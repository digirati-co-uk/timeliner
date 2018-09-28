import { take, fork, put, all, select } from 'redux-saga/effects';

import { IMPORT_DOCUMENT, RESET_DOCUMENT } from '../constants/project';
import { UPDATE_RANGE } from '../constants/range';
import { loadProjectState } from '../utils/iiifLoader';
import { loadProject } from '../actions/project';
import { loadCanvas } from '../actions/canvas';
import { loadRanges, movePoint } from '../actions/range';
import {
  loadViewState,
  editMetadata,
  setCurrentTime,
} from '../actions/viewState';
import { NEXT_BUBBLE, PREVIOUS_BUBBLE } from '../constants/viewState';

const getDuration = state => state.viewState.runTime;

const getNextBubbleStartTime = state => {
  const currentTime = state.viewState.currentTime;
  const result = Math.min.apply(
    null,
    Object.values(state.range)
      .filter(bubble => bubble.startTime > currentTime)
      .map(bubble => bubble.startTime)
  );
  console.log('getNextBubbleStartTime', result);
  return result === Infinity ? currentTime : result;
};

const getPreviousBubbleStartTime = state => {
  const currentTime = state.viewState.currentTime;
  const result = Object.values(state.range)
    .filter(bubble => bubble.startTime < currentTime)
    .map(bubble => bubble.startTime)
    .sort()
    .slice(-2, -1)[0];
  console.log('getPreviousBubbleStartTime', result);
  return result || 0;
};

function* watchImport() {
  while (true) {
    const { manifest } = yield take(IMPORT_DOCUMENT);
    const loadedState = loadProjectState(manifest);
    yield put(loadProject(loadedState.project));
    yield put(loadCanvas(loadedState.canvas));
    yield put(loadRanges(loadedState.range));
    yield put(loadViewState(loadedState.viewState));
  }
}

function* watchSaveRange() {
  while (true) {
    const { payload } = yield take(UPDATE_RANGE);
    const { startTime, endTime } = payload;
    if (startTime) {
      yield put(movePoint(startTime.x, startTime.originalX));
    }
    if (endTime) {
      yield put(movePoint(endTime.x, endTime.originalX));
    }
    yield put(editMetadata(null));
  }
}

function* watchResetDocument() {
  while (true) {
    yield take(RESET_DOCUMENT);
    const duration = yield select(getDuration);
    yield put(loadRanges(duration));
  }
}

function* watchPreviousBubble() {
  while (true) {
    yield take(NEXT_BUBBLE);
    const nextBubbleTime = yield select(getNextBubbleStartTime);
    yield put(setCurrentTime(nextBubbleTime));
  }
}

function* watchNextBubble() {
  while (true) {
    yield take(PREVIOUS_BUBBLE);
    const previousBubbleTime = yield select(getPreviousBubbleStartTime);
    yield put(setCurrentTime(previousBubbleTime));
  }
}

export default function* root() {
  yield all([
    fork(watchImport),
    fork(watchSaveRange),
    fork(watchResetDocument),
    fork(watchPreviousBubble),
    fork(watchNextBubble),
  ]);
}
