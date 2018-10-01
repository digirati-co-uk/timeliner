import { put, select, takeEvery } from 'redux-saga/effects';

import { IMPORT_DOCUMENT, RESET_DOCUMENT } from '../constants/project';
import { UPDATE_RANGE } from '../constants/range';
import { loadProjectState } from '../utils/iiifLoader';
import exporter from '../utils/iiifSaver';
import { loadProject } from '../actions/project';
import { loadCanvas } from '../actions/canvas';
import { loadRanges, movePoint } from '../actions/range';
import {
  loadViewState,
  editMetadata,
  setCurrentTime,
} from '../actions/viewState';
import { NEXT_BUBBLE, PREVIOUS_BUBBLE } from '../constants/viewState';
import { EXPORT_DOCUMENT } from '../constants/project';

const getDuration = state => state.viewState.runTime;

const getPreviousBubbleStartTime = state => {
  const currentTime = state.viewState.currentTime;
  const result = Math.min.apply(
    null,
    Object.values(state.range)
      .filter(bubble => bubble.startTime > currentTime)
      .map(bubble => bubble.startTime)
  );
  return result === Infinity ? currentTime : result;
};

const getNextBubbleStartTime = state => {
  const currentTime = state.viewState.currentTime;
  const result = Object.values(state.range)
    .filter(bubble => bubble.startTime < currentTime)
    .map(bubble => bubble.startTime)
    .sort()
    .slice(-2, -1)[0];
  return result || 0;
};

const getState = state => state;

function* importDocument({ manifest }) {
  const loadedState = loadProjectState(manifest);
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

function* resetDocument() {
  const duration = yield select(getDuration);
  yield put(loadRanges(duration));
}

function* previousBubble() {
  const nextBubbleTime = yield select(getNextBubbleStartTime);
  yield put(setCurrentTime(nextBubbleTime));
}

function* nextBubble() {
  const previousBubbleTime = yield select(getPreviousBubbleStartTime);
  yield put(setCurrentTime(previousBubbleTime));
}

function* exportDocument() {
  const state = yield select(getState);
  const outputJSON = exporter(state);
  console.log(outputJSON);
  const mime_type = 'application/json';

  const blob = new Blob([JSON.stringify(outputJSON, null, 2)], {
    type: mime_type,
  });

  var dlink = document.createElement('a');
  dlink.download = 'manifest.json';
  dlink.href = window.URL.createObjectURL(blob);
  dlink.onclick = function(e) {
    // revokeObjectURL needs a delay to work properly
    var that = this;
    setTimeout(function() {
      window.URL.revokeObjectURL(that.href);
    }, 1500);
  };

  dlink.click();
  dlink.remove();
}

export default function* root() {
  yield takeEvery(IMPORT_DOCUMENT, importDocument);
  yield takeEvery(UPDATE_RANGE, saveRange);
  yield takeEvery(RESET_DOCUMENT, resetDocument);
  yield takeEvery(PREVIOUS_BUBBLE, previousBubble);
  yield takeEvery(NEXT_BUBBLE, nextBubble);
  yield takeEvery(EXPORT_DOCUMENT, exportDocument);
}
