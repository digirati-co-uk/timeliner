import {
  put,
  select,
  takeEvery,
  race,
  call,
  take,
  takeLatest,
} from 'redux-saga/effects';

import {
  IMPORT_DOCUMENT,
  RESET_DOCUMENT,
  UPDATE_SETTINGS,
} from '../constants/project';
import { UPDATE_RANGE } from '../constants/range';
import { loadProjectState, parseMarkers } from '../utils/iiifLoader';
import exporter from '../utils/iiifSaver';
import {
  loadProject,
  setTitle,
  setDescription,
  importError,
} from '../actions/project';
import { loadCanvas, unloadAudio } from '../actions/canvas';
import {
  loadRanges,
  movePoint,
  deleteRedundantSizes,
  updateDepthsAfterDelete,
  deleteRange,
} from '../actions/range';
import {
  loadViewState,
  editMetadata,
  setCurrentTime,
  openVerifyDialog,
  closeVerifyDialog,
  play,
  pause,
  cancelProjectMetadataEdits,
  loadSource,
  panToPosition,
  zoomIn,
  zoomTo,
} from '../actions/viewState';
import {
  NEXT_BUBBLE,
  PREVIOUS_BUBBLE,
  CONFIRM_NO,
  CONFIRM_YES,
  SAVE_PROJECT_METADATA,
  SET_CURRENT_TIME,
  ZOOM_IN,
  ZOOM_OUT,
  PAN_TO_POSITION,
  PLAY_AUDIO,
} from '../constants/viewState';
import {
  SELECT_RANGE,
  DELETE_RAGE,
  DELETE_RAGES,
  RANGE,
} from '../constants/range';
import { EXPORT_DOCUMENT, PROJECT } from '../constants/project';
import { serialize } from '../utils/iiifSerializer';
import { immediateDownload } from '../utils/fileDownload';
import { SELECT_MARKER, UPDATE_MARKER } from '../constants/markers';
import { hideMarkers, importMarkers, showMarkers } from '../actions/markers';

const getDuration = state => state.viewState.runTime;

const getCurrentTime = state => state.viewState.currentTime;

const getPoints = state =>
  Array.from(
    Object.values(state.range).reduce((markers, range) => {
      markers.add(range.startTime);
      markers.add(range.endTime);
      return markers;
    }, new Set([]))
  )
    .concat(
      state.markers.visible
        ? Object.values(state.markers.list).map(marker => marker.time)
        : []
    )
    .sort();

const getNextBubbleStartTime = state => {
  const currentTime = state.viewState.currentTime;
  const result = Math.min.apply(
    null,
    getPoints(state).filter(point => point > currentTime)
  );
  return {
    time: result === Infinity ? state.viewState.runTime : result,
    doStop: result === Infinity,
  };
};

const TIME_BEFORE_REVERSE = 1000;
const getPreviousBubbleStartTime = state => {
  const currentTime = state.viewState.currentTime;
  const result = Math.max.apply(
    null,
    getPoints(state)
      .filter(point => point < currentTime - TIME_BEFORE_REVERSE)
      .reverse()
  );

  return result === Infinity || result <= 0 ? 0 : result;
};

const getSelectedBubbles = state =>
  Object.values(state.range)
    .filter(bubble => bubble.isSelected)
    .sort((bubbleA, bubbleB) =>
      bubbleA[RANGE.START_TIME] === bubbleB[RANGE.START_TIME]
        ? bubbleA[RANGE.DEPTH] - bubbleB[RANGE.DEPTH]
        : bubbleA[RANGE.START_TIME] - bubbleB[RANGE.START_TIME]
    );

const getState = state => state;

const getViewerWidth = state => state.viewState.viewerWidth;

function* importDocument({ manifest, source }) {
  const { viewState } = yield select();

  if (viewState.source === source) {
    return;
  }

  try {
    const loadedState = loadProjectState(manifest);
    yield put(unloadAudio());
    yield put(loadProject(loadedState.project));
    yield put(loadCanvas(loadedState.canvas));
    yield put(loadRanges(loadedState.range));
    yield put(loadViewState(loadedState.viewState));
    yield put(importMarkers(parseMarkers(manifest)));
  } catch (err) {
    console.error(err);
    yield put(importError(err));
  }
}

function* saveRange({ payload }) {
  const { startTime, endTime } = payload;
  if (startTime) {
    yield put(movePoint(startTime.x, startTime.originalX));
  }
  if (endTime) {
    yield put(movePoint(endTime.x, endTime.originalX));
  }
  yield put(editMetadata(null));
}

function* showConfirmation(message) {
  yield put(openVerifyDialog(message));

  const { yes } = yield race({
    yes: take(CONFIRM_YES),
    no: take(CONFIRM_NO),
  });

  yield put(closeVerifyDialog());

  return !!yes;
}

function* resetDocument() {
  const confirmed = yield call(
    showConfirmation,
    'Are you sure you want to delete all ranges?'
  );
  if (confirmed) {
    const duration = yield select(getDuration);
    yield put(loadRanges(duration));
  }
}

function* previousBubble() {
  const previousBubbleTime = yield select(getPreviousBubbleStartTime);
  yield put(setCurrentTime(previousBubbleTime));
}

function* nextBubble() {
  const nextBubbleTime = yield select(getNextBubbleStartTime);
  yield put(setCurrentTime(nextBubbleTime.time));
}

function* exportDocument() {
  const state = yield select(getState);
  const label = yield select(
    s =>
      `${s.project[PROJECT.TITLE].replace(/[ ,.'"]/g, '_') || 'manifest'}.json`
  );
  const outputJSON = exporter(state);
  immediateDownload(label, serialize(outputJSON));
}

function* selectSideEffects({ payload }) {
  const state = yield select(getState);
  const selectedBubbles = yield select(getSelectedBubbles);
  if (state.project[PROJECT.START_PLAYING_WHEN_BUBBLES_CLICKED]) {
    if (payload.isSelected) {
      if (
        selectedBubbles[0][RANGE.START_TIME] ===
        state.range[payload.id][RANGE.START_TIME]
      ) {
        yield put(play());
        yield put(setCurrentTime(state.range[payload.id][RANGE.START_TIME]));
      }
    } else {
      yield put(pause());
    }
  }
}

function* saveProjectMetadata({ metadata }) {
  const { manifestLabel, manifestSummary } = metadata;
  yield put(setTitle(manifestLabel));
  yield put(setDescription(manifestSummary));
  yield put(cancelProjectMetadataEdits());
}

function* afterDelete() {
  yield put(deleteRedundantSizes());
  yield put(updateDepthsAfterDelete());
}

function* multiDelete({ ranges }) {
  let confirmed = true;
  if (ranges.length > 1) {
    confirmed = yield call(
      showConfirmation,
      'Multiple ranges will be deleted. Redundant length groups will be removed. Do you wish to continue?'
    );
  }
  if (confirmed) {
    for (let i = 0; i < ranges.length; i++) {
      yield put(deleteRange(ranges[i]));
    }
  }
}

function* currentTimeSideEffects(action) {
  const selectedBubbles = yield select(getSelectedBubbles);
  // Nope out early if we've not selected anything.
  if (!selectedBubbles.length) {
    return;
  }

  const state = yield select(getState);
  const time = yield select(getCurrentTime);
  const startPlayingAtEnd = state.project[PROJECT.START_PLAYING_END_OF_SECTION];
  const stopPlayingAtEnd = state.project[PROJECT.STOP_PLAYING_END_OF_SECTION];
  const startTime = selectedBubbles[0][RANGE.START_TIME];
  const endTime = selectedBubbles[selectedBubbles.length - 1][RANGE.END_TIME];

  if ((action.type === PLAY_AUDIO && time <= startTime) || time >= endTime) {
    return;
  }

  // Last time stores previous tick time so that we can compare the gap.
  let lastTime = 0;
  // Click stores if we have made a jump in this code, so we can skip it
  // in our checks when trying to identify user clicks.
  // @todo improvement if we can identify different sources of `SET_CURRENT_TIME` then
  //   we can more easily know if the jumps in the time are from human clicks or automated.
  let clicked = false;
  // We want to listen for every tick of the time.
  while (true) {
    const {
      payload: { currentTime },
    } = yield take(SET_CURRENT_TIME);

    // @todo review this logic.
    // // This logic is for cancelling the listener to the current time.
    // if (
    //   clicked === false &&
    //   lastTime &&
    //   Math.abs(currentTime - lastTime) >= 1000
    // ) {
    //   // If the user skips more than a second
    //   break;
    // }

    // Reset the clicked value if set.
    if (clicked) {
      clicked = false;
    }

    // Set a new last time, since we're done using it.
    lastTime = currentTime;

    // When the time goes past the end of a section
    if (currentTime >= endTime) {
      if (startPlayingAtEnd) {
        // Set a clicked value so we know to skip the user click check.
        clicked = true;
        // Either we start playing from the beginning of the section.
        yield put(setCurrentTime(startTime));
      } else if (stopPlayingAtEnd) {
        // Or we pause.
        yield put(pause());
      }
    }
  }
}

function* selectMarker({ payload: { id } }) {
  const marker = yield select(state => state.markers.list[id]);
  const startPlaying = yield select(
    state => state.project[PROJECT.START_PLAYING_WHEN_BUBBLES_CLICKED]
  );
  yield put(setCurrentTime(marker.time));

  if (startPlaying) {
    yield put(play());
  }
}

function* updateMarkerTime({ payload: { id, time } }) {
  if (time) {
    yield put(setCurrentTime(time));
  }
}

function* updateSettings({ payload }) {
  if (payload.showMarkers) {
    yield put(showMarkers());
  } else {
    yield put(hideMarkers());
  }
}

function* zoomSideEffects(action) {
  const zoom = yield select(state => state.viewState.zoom);
  const duration = yield select(getDuration);
  const x = yield select(state => state.viewState.x);
  // Nothing to do if we are zoom 1.
  if (zoom === 1) {
    return;
  }

  // We want to react to time changes, to check if its still visible on screen.
  while (true) {
    const {
      payload: { currentTime },
    } = yield take(SET_CURRENT_TIME);
    const viewportWidth = yield select(getViewerWidth);

    const sliderWidth = viewportWidth * zoom;
    const percentThrough = currentTime / duration;
    const maxMiddle = sliderWidth - viewportWidth;
    const pixelThrough = percentThrough * sliderWidth;
    const from = Math.floor(x) - 20;
    const to = Math.ceil(x + viewportWidth) + 20;
    const isVisible = pixelThrough >= from && pixelThrough <= to;

    // If its not visible, pan to the middle.
    if (isVisible === false) {
      // Let's check a new case.
      // - currentTime within selected range
      // - zoom to range instead.
      const shouldZoomToRange = yield call(timeWithinSelection, currentTime);
      if (shouldZoomToRange) {
        yield call(zoomToSelection);
        return;
      }

      const targetPan = pixelThrough - viewportWidth / 2;
      if (targetPan <= 0) {
        yield put(panToPosition(0));
        return;
      }
      if (targetPan >= maxMiddle) {
        yield put(panToPosition(maxMiddle));
        return;
      }
      yield put(panToPosition(targetPan));
      return;
    }
  }
}

function* timeWithinSelection(time) {
  const selectedBubbles = yield select(getSelectedBubbles);

  // Only applies when selecting multiple bubbles.
  if (selectedBubbles.length <= 1) {
    return false;
  }

  const startTime = selectedBubbles[0][RANGE.START_TIME];
  const endTime = selectedBubbles[selectedBubbles.length - 1][RANGE.END_TIME];

  return time >= startTime && time <= endTime;
}

function* zoomToSelection() {
  const selectedBubbles = yield select(getSelectedBubbles);

  // Only applies when selecting multiple bubbles.
  if (selectedBubbles.length <= 1) {
    return;
  }

  const duration = yield select(getDuration);
  const viewerWidth = yield select(getViewerWidth);
  const startTime = selectedBubbles[0][RANGE.START_TIME];
  const endTime = selectedBubbles[selectedBubbles.length - 1][RANGE.END_TIME];

  const percentVisible = (endTime - startTime) / duration;
  const percentStart = startTime / duration;
  const targetZoom = 1 / percentVisible;
  const targetPixelStart = percentStart * (viewerWidth * targetZoom);

  yield put(zoomTo(targetZoom));
  yield put(panToPosition(targetPixelStart));
}

const getZoom = state => state.viewState.zoom;

function* zoomInOut(action) {
  const ZOOM_AMOUNT = action.type === ZOOM_IN ? 1.2 : 1 / 1.2;
  const zoom = yield select(getZoom);
  const duration = yield select(getDuration);
  const currentTime = yield select(getCurrentTime);
  const ZOOM_ORIGIN = currentTime / duration;
  const viewerWidth = yield select(getViewerWidth);
  const targetViewerWidth = viewerWidth * zoom * ZOOM_AMOUNT;
  const viewerOffsetLeft = (targetViewerWidth - viewerWidth) * ZOOM_ORIGIN;

  yield put(zoomTo(zoom * ZOOM_AMOUNT));
  yield put(panToPosition(viewerOffsetLeft));
}

export default function* root() {
  yield takeEvery(IMPORT_DOCUMENT, importDocument);
  yield takeEvery(UPDATE_RANGE, saveRange);
  yield takeEvery(RESET_DOCUMENT, resetDocument);
  yield takeEvery(PREVIOUS_BUBBLE, previousBubble);
  yield takeEvery(NEXT_BUBBLE, nextBubble);
  yield takeEvery(EXPORT_DOCUMENT, exportDocument);
  yield takeEvery(SELECT_RANGE, selectSideEffects);
  yield takeEvery(SAVE_PROJECT_METADATA, saveProjectMetadata);
  yield takeEvery(DELETE_RAGE, afterDelete);
  yield takeEvery(DELETE_RAGES, multiDelete);
  yield takeLatest([SELECT_RANGE, PLAY_AUDIO], currentTimeSideEffects);
  yield takeEvery(SELECT_MARKER, selectMarker);
  yield takeEvery(UPDATE_MARKER, updateMarkerTime);
  yield takeEvery(UPDATE_SETTINGS, updateSettings);
  yield takeLatest(
    [ZOOM_IN, ZOOM_OUT, PAN_TO_POSITION, PLAY_AUDIO],
    zoomSideEffects
  );
  yield takeLatest(SELECT_RANGE, zoomToSelection);
  yield takeEvery([ZOOM_IN, ZOOM_OUT], zoomInOut);
}
