import { take, fork, put, all, select } from 'redux-saga/effects';

import { IMPORT_DOCUMENT, RESET_DOCUMENT } from '../constants/project';
import { UPDATE_RANGE } from '../constants/range';
import { loadProjectState } from '../utils/iiifLoader';
import { loadProject } from '../actions/project';
import { loadCanvas } from '../actions/canvas';
import { loadRanges, movePoint } from '../actions/range';
import { loadViewState, editMetadata } from '../actions/viewState';

const getDuration = state => state.viewState.runTime;

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
export default function* root() {
  yield all([
    fork(watchImport),
    fork(watchSaveRange),
    fork(watchResetDocument),
  ]);
}
