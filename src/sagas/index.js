import { take, fork, put, all } from 'redux-saga/effects';

import { IMPORT_DOCUMENT } from '../constants/project';
import { UPDATE_RANGE } from '../constants/range';
import { loadProjectState } from '../utils/iiifLoader';
import { loadProject } from '../actions/project';
import { loadCanvas } from '../actions/canvas';
import { loadRanges } from '../actions/range';
import { loadViewState, editMetadata } from '../actions/viewState';

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
    yield take(UPDATE_RANGE);
    yield put(editMetadata(null));
  }
}

export default function* root() {
  yield all([fork(watchImport), fork(watchSaveRange)]);
}
