import { put, select, takeEvery, race, call, take } from 'redux-saga/effects';

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
  openVerifyDialog,
  closeVerifyDialog,
  play,
  pause,
} from '../actions/viewState';
import {
  NEXT_BUBBLE,
  PREVIOUS_BUBBLE,
  CONFIRM_NO,
  CONFIRM_YES,
} from '../constants/viewState';
import {
  SELECT_RANGE
} from '../constants/range';
import { EXPORT_DOCUMENT } from '../constants/project';
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

function* selectSideEffects({payload}) {
  const state = yield select(getState);
  if (state.project.startPlayingWhenBubbleIsClicked) {
    if (payload.isSelected) {
      yield put(play());
    } else {
      yield put(pause());
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
}
