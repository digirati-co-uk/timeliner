import { take, fork, put, all } from 'redux-saga/effects';

import { IMPORT_DOCUMENT } from '../constants/project';
import { loadProjectState } from '../utils/iiifLoader';
import { loadProject } from '../actions/project';
import { loadCanvas } from '../actions/canvas';
import { loadRanges } from '../actions/range';
import { loadViewState } from '../actions/viewState';

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

export default function* root() {
  yield all([fork(watchImport)]);
}
