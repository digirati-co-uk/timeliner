import {
  all,
  put,
  select,
  takeEvery,
  race,
  call,
  take,
  takeLatest,
} from 'redux-saga/effects';
import { DELETE_RANGE, DESELECT_RANGE, SELECT_RANGE } from '../constants/range';
import { loadProjectState, parseMarkers } from '../utils/iiifLoader';
import { actions as undoActions } from 'redux-undo-redo';
import {
  PROJECT,
  IMPORT_DOCUMENT,
  RESET_DOCUMENT,
  EXPORT_DOCUMENT,
  UPDATE_SETTINGS,
  SAVE_PROJECT,
} from '../constants/project';
import exporter from '../utils/iiifSaver';
import {
  loadProject,
  setTitle,
  setDescription,
  importError,
} from '../actions/project';
import { loadCanvas, unloadAudio } from '../actions/canvas';
import { createRange, rangeMutations, importRanges } from '../actions/range';
import {
  loadViewState,
  openVerifyDialog,
  closeVerifyDialog,
  cancelProjectMetadataEdits,
  setCurrentTime,
  play,
  zoomTo,
  panToPosition,
} from '../actions/viewState';
import {
  CONFIRM_NO,
  CONFIRM_YES,
  PAN_TO_POSITION,
  PLAY_AUDIO,
  SAVE_PROJECT_METADATA,
  SET_CURRENT_TIME,
  UNDO_ALL,
  ZOOM_IN,
  ZOOM_OUT,
} from '../constants/viewState';
import { serialize } from '../utils/iiifSerializer';
import { immediateDownload } from '../utils/fileDownload';
import {
  getRangeList,
  getRangesByIds,
  getSelectedRanges,
} from '../reducers/range';
import rangeSaga from './range-saga';
import { SELECT_MARKER, UPDATE_MARKER } from '../constants/markers';
import {
  clearMarkers,
  hideMarkers,
  importMarkers,
  showMarkers,
} from '../actions/markers';

const getDuration = state => state.viewState.runTime;

const getCurrentTime = state => state.viewState.currentTime;

function* importDocument({ manifest, source }) {
  const { viewState } = yield select();

  if (viewState.source === source) {
    return;
  }

  yield put(undoActions.clear());

  try {
    const loadedState = loadProjectState(manifest);
    yield put(unloadAudio());
    yield put(loadProject(loadedState.project));
    yield put(loadViewState(loadedState.viewState));
    yield put(loadCanvas(loadedState.canvas));
    yield put(importRanges(loadedState.range));
    yield put(clearMarkers());
    yield put(importMarkers(parseMarkers(manifest)));
  } catch (err) {
    console.error(err);
    yield put(importError(err));
  }
}

export function* showConfirmation(message, doCancel=true) {
  yield put(openVerifyDialog(message, doCancel));

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
    'Are you sure you want to delete all sections?'
  );
  if (confirmed) {
    const rangeIds = yield select(s => Object.keys(getRangeList(s)));

    yield put(undoActions.clear());
    const duration = yield select(getDuration);

    yield put(
      rangeMutations([
        ...rangeIds.map(range => ({
          type: 'DELETE_RANGE',
          payload: { id: range },
        })),
        createRange({ startTime: 0, endTime: duration }),
      ])
    );
  }
}

function* exportDocument() {
  const state = yield select();
  const label = yield select(
    s =>
      `${s.project[PROJECT.TITLE].replace(/[ ,.'"]/g, '_') || 'manifest'}.json`
  );
  const outputJSON = exporter(state);
  immediateDownload(label, serialize(outputJSON));
}

function* saveProjectMetadata({ metadata }) {
  const { title, description } = yield select(state => state.project);
  const { manifestLabel, manifestSummary } = metadata;

  if (title !== manifestLabel) {
    yield put(setTitle(manifestLabel));
  }
  if (description !== manifestSummary) {
    yield put(setDescription(manifestSummary));
  }
  yield put(cancelProjectMetadataEdits());
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

function* zoomSideEffects() {
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

const getViewerWidth = state => state.viewState.viewerWidth;

function* timeWithinSelection(time) {
  const selectedRangeIds = yield select(getSelectedRanges);
  // Only applies when selecting multiple bubbles.
  if (selectedRangeIds.length <= 1) {
    return false;
  }

  const selectedRanges = yield select(getRangesByIds(selectedRangeIds));

  const startTime = Math.min(...selectedRanges.map(range => range.startTime));
  const endTime = Math.max(...selectedRanges.map(range => range.endTime));

  return time >= startTime && time <= endTime;
}

function* zoomToSelection(action) {
  const selectedRangeIds = yield select(getSelectedRanges);
  // Only applies when selecting multiple bubbles.
  if (selectedRangeIds.length <= 1 || action.payload.deselectOthers) {
    return false;
  }

  const selectedRanges = yield select(getRangesByIds(selectedRangeIds));

  const duration = yield select(getDuration);
  const viewerWidth = yield select(getViewerWidth);
  const startTime = Math.min(...selectedRanges.map(range => range.startTime));
  const endTime = Math.max(...selectedRanges.map(range => range.endTime));

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

function saveResource(url, content) {
  return new Promise((resolve, reject) => {
    const http = new XMLHttpRequest();
    http.open('POST', url);
    http.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    http.onreadystatechange = () => {
      if (http.readyState === http.DONE) {
        if (200 <= http.status && http.status <= 299) {
          // reload parent widow to location of newly created timeline
          if (document.referrer!=http.getResponseHeader('location')){
            reject({redirect_location: http.getResponseHeader('location')})
            return;
          }
          resolve();
        } else {
          reject(new Error("Save Failed: "+http.status+", "+http.statusText));
        }
      }
    };
    http.send(JSON.stringify(content));
  });
}

function* saveProject() {
  const state = yield select();
  const callback = yield select(s => s.viewState.callback);
  const resource = yield select(s => s.viewState.resource);
  if (resource !== callback) {
    const yes = yield showConfirmation(
      'This will save the original timeline as a copy. Are you sure?'
    );
    if (!yes) {
      return;
    }
  }
  const outputJSON = exporter(state);

  try {
    yield call(saveResource, callback, outputJSON)
    yield showConfirmation('Saved Successfully.', false)
  }
  catch (result) {
    if (result.hasOwnProperty('redirect_location')) {
      top.window.location = result.redirect_location;
      return;
    }
    yield showConfirmation(result.message, false)
  }
}

function* undoAll() {
  const undoStack = yield select(s => s.undoHistory.undoQueue);

  const yes = yield showConfirmation(
    'Are you sure you want to revert all your changes?'
  );
  if (!yes) {
    return;
  }

  for (let i = 0; i < undoStack.length; i++) {
    yield put(undoActions.undo());
  }
}

export default function* root() {
  yield all([
    rangeSaga(),
    takeEvery(IMPORT_DOCUMENT, importDocument),
    takeEvery(RESET_DOCUMENT, resetDocument),
    takeEvery(EXPORT_DOCUMENT, exportDocument),
    takeEvery(SAVE_PROJECT_METADATA, saveProjectMetadata),
    takeEvery(SELECT_MARKER, selectMarker),
    takeEvery(UPDATE_MARKER, updateMarkerTime),
    takeEvery(UPDATE_SETTINGS, updateSettings),
    takeLatest(
      [ZOOM_IN, ZOOM_OUT, PAN_TO_POSITION, PLAY_AUDIO],
      zoomSideEffects
    ),
    takeEvery([ZOOM_IN, ZOOM_OUT], zoomInOut),
    takeEvery(SAVE_PROJECT, saveProject),
    takeEvery(UNDO_ALL, undoAll),
  ]);
}
