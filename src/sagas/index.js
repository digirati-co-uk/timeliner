import {
  all,
  put,
  select,
  takeEvery,
  race,
  call,
  take,
} from 'redux-saga/effects';
import { DELETE_RANGE } from '../constants/range';
import { loadProjectState, parseMarkers } from '../utils/iiifLoader';
import { actions as undoActions } from 'redux-undo-redo';
import {
  PROJECT,
  IMPORT_DOCUMENT,
  RESET_DOCUMENT,
  EXPORT_DOCUMENT,
  UPDATE_SETTINGS,
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
} from '../actions/viewState';
import {
  CONFIRM_NO,
  CONFIRM_YES,
  SAVE_PROJECT_METADATA,
} from '../constants/viewState';
import { serialize } from '../utils/iiifSerializer';
import { immediateDownload } from '../utils/fileDownload';
import { getRangeList } from '../reducers/range';
import rangeSaga from './range-saga';
import { SELECT_MARKER, UPDATE_MARKER } from '../constants/markers';
import {
  clearMarkers,
  hideMarkers,
  importMarkers,
  showMarkers,
} from '../actions/markers';

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
    yield put(clearMarkers());
    yield put(importMarkers(parseMarkers(manifest)));
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
  ]);
}
