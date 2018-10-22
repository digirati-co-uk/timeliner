import { put, select, takeEvery, race, call, take } from 'redux-saga/effects';

import { IMPORT_DOCUMENT, RESET_DOCUMENT } from '../constants/project';
import { UPDATE_RANGE } from '../constants/range';
import { loadProjectState } from '../utils/iiifLoader';
import exporter from '../utils/iiifSaver';
import { loadProject, setTitle, setDescription } from '../actions/project';
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
} from '../actions/viewState';
import {
  NEXT_BUBBLE,
  PREVIOUS_BUBBLE,
  CONFIRM_NO,
  CONFIRM_YES,
  SAVE_PROJECT_METADATA,
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

const getDuration = state => state.viewState.runTime;

const getPoints = state =>
  Array.from(
    Object.values(state.range).reduce((markers, range) => {
      markers.add(range.startTime);
      markers.add(range.endTime);
      return markers;
    }, new Set([]))
  ).sort();

const getNextBubbleStartTime = state => {
  const currentTime = state.viewState.currentTime;
  const result = Math.min.apply(
    null,
    getPoints(state).filter(point => point > currentTime)
  );
  return {
    time: result === Infinity ? state.viewState.runTime + 1 : result + 1,
    doStop: result === Infinity,
  };
};

const getPreviousBubbleStartTime = state => {
  const currentTime = state.viewState.currentTime;
  const result = getPoints(state)
    .filter(point => point <= currentTime)
    .slice(-2, -1)[0];
  return result || 0;
};

const getSelectedBubbles = state =>
  Object.values(state.range)
    .filter(bubble => bubble.isSelected)
    .sort(
      (bubbleA, bubbleB) =>
        bubbleA[RANGE.START_TIME] === bubbleB[RANGE.START_TIME]
          ? bubbleA[RANGE.DEPTH] - bubbleB[RANGE.DEPTH]
          : bubbleA[RANGE.START_TIME] - bubbleB[RANGE.START_TIME]
    );

const getState = state => state;

function* importDocument({ manifest }) {
  const loadedState = loadProjectState(manifest);
  yield put(unloadAudio());
  yield put(loadProject(loadedState.project));
  yield put(loadCanvas(loadedState.canvas));
  yield put(loadRanges(loadedState.range));
  yield put(loadViewState(loadedState.viewState));
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
  const outputJSON = exporter(state);
  immediateDownload(serialize(outputJSON));
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

function* multiDelete({ selecteds }) {
  let confirmed = true;
  if (selecteds.length > 1) {
    confirmed = yield call(
      showConfirmation,
      'Multiple ranges will be deleted. Redundant length groups will be removed. Are you wish to continue?'
    );
  }
  if (confirmed) {
    for (var i = 0; i < selecteds.length; i++) {
      yield put(deleteRange(selecteds[i]));
    }
  }
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
}
