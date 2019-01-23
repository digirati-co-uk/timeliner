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
import { actions as undoActions } from 'redux-undo-redo';
import { IMPORT_DOCUMENT, RESET_DOCUMENT } from '../constants/project';
import {
  DECREASE_RANGE_DEPTH,
  DELETE_RANGE,
  GROUP_RANGES,
  MOVE_POINT,
  SCHEDULE_DELETE_RANGE,
  SCHEDULE_DELETE_RANGES,
  SPLIT_RANGE_AT,
  UPDATE_RANGE,
} from '../constants/range';
import { loadProjectState } from '../utils/iiifLoader';
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
  scheduleDeleteRange,
  updateRangeTime,
  createRange,
  rangeMutations,
  deleteRange,
  increaseRangeDepth,
  decreaseRangeDepth,
  importRanges,
} from '../actions/range';
import {
  loadViewState,
  openVerifyDialog,
  closeVerifyDialog,
  cancelProjectMetadataEdits,
} from '../actions/viewState';
import {
  CONFIRM_NO,
  CONFIRM_YES,
  SAVE_PROJECT_METADATA,
} from '../constants/viewState';
import { EXPORT_DOCUMENT } from '../constants/project';
import { serialize } from '../utils/iiifSerializer';
import { immediateDownload } from '../utils/fileDownload';
import { getRangeList } from '../reducers/range';
import rangeSaga from './range-saga';

const getDuration = state => state.viewState.runTime;

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
    yield put(loadCanvas(loadedState.canvas));
    yield put(importRanges(loadedState.range));
    yield put(loadViewState(loadedState.viewState));
  } catch (err) {
    console.error(err);
    yield put(importError(err));
  }
}

export function* showConfirmation(message) {
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
  const outputJSON = exporter(state);
  immediateDownload(serialize(outputJSON));
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

export default function* root() {
  yield all([
    rangeSaga(),
    takeEvery(IMPORT_DOCUMENT, importDocument),
    takeEvery(RESET_DOCUMENT, resetDocument),
    takeEvery(EXPORT_DOCUMENT, exportDocument),
    takeEvery(SAVE_PROJECT_METADATA, saveProjectMetadata),
  ]);
}
