import {
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
  GROUP_RANGES,
  MOVE_POINT,
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
  deleteRange,
  updateRangeTime,
  createRange,
  rangeMutations,
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
  SET_CURRENT_TIME,
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
import {
  getRangeList,
  getRangesAtPoint,
  getRangesBetweenTimes,
  getRangesByIds,
  getSelectedRanges,
} from '../reducers/range';

const getDuration = state => state.viewState.runTime;

const getPoints = state =>
  Array.from(
    Object.values(getRangeList(state)).reduce((markers, range) => {
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
  Object.values(getRangeList(state))
    .filter(bubble => bubble.isSelected)
    .sort((bubbleA, bubbleB) =>
      bubbleA[RANGE.START_TIME] === bubbleB[RANGE.START_TIME]
        ? bubbleA[RANGE.DEPTH] - bubbleB[RANGE.DEPTH]
        : bubbleA[RANGE.START_TIME] - bubbleB[RANGE.START_TIME]
    );

const getState = state => state;

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
    // yield put(loadRanges(loadedState.range));
    yield put({
      type: 'IMPORT_RANGES',
      payload: { ranges: loadedState.range },
    });
    yield put(loadViewState(loadedState.viewState));
  } catch (err) {
    console.error(err);
    yield put(importError(err));
  }
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
  const ranges = yield select(getRangeList);
  const selectedBubbles = yield select(getSelectedBubbles);
  if (state.project[PROJECT.START_PLAYING_WHEN_BUBBLES_CLICKED]) {
    if (payload.isSelected) {
      if (
        selectedBubbles[0][RANGE.START_TIME] ===
        ranges[payload.id][RANGE.START_TIME]
      ) {
        yield put(play());
        yield put(setCurrentTime(ranges[payload.id][RANGE.START_TIME]));
      }
    } else {
      yield put(pause());
    }
  }
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

function* afterDelete() {
  // const removals = [];
  // const ranges = yield select(getRangeList);

  // Object.values(ranges)
  //   .sort(
  //     (a, b) =>
  //       b[RANGE.END_TIME] -
  //       b[RANGE.START_TIME] -
  //       (a[RANGE.END_TIME] - a[RANGE.START_TIME])
  //   )
  //   .forEach((item, index, array) => {
  //     if (index > 0) {
  //       const previousItem = array[index - 1];
  //       if (
  //         previousItem[RANGE.START_TIME] === item[RANGE.START_TIME] &&
  //         previousItem[RANGE.END_TIME] === item[RANGE.END_TIME]
  //       ) {
  //         removals.push({
  //           type: 'DELETE_RANGE',
  //           payload: {
  //             id:
  //               previousItem[RANGE.DEPTH] > item[RANGE.DEPTH]
  //                 ? previousItem.id
  //                 : item.id,
  //           },
  //         });
  //       }
  //     }
  //   });
  /* deleteRedundantSizes

  const removals = {
        $unset: [],
      };
      Object.values(state)
        .sort(
          (a, b) =>
            b[RANGE.END_TIME] -
            b[RANGE.START_TIME] -
            (a[RANGE.END_TIME] - a[RANGE.START_TIME])
        )
        .forEach((item, index, array) => {
          if (index > 0) {
            const previousItem = array[index - 1];
            if (
              previousItem[RANGE.START_TIME] === item[RANGE.START_TIME] &&
              previousItem[RANGE.END_TIME] === item[RANGE.END_TIME]
            ) {
              removals.$unset.push(
                previousItem[RANGE.DEPTH] > item[RANGE.DEPTH]
                  ? previousItem.id
                  : item.id
              );
            }
          }
        });
      return removals.$unset.length > 0 ? update(state, removals) : state;
   */

  // @todo
  // yield put(deleteRedundantSizes());
  // yield put(updateDepthsAfterDelete());
}

function* multiDelete({ ranges }) {
  if (ranges.length > 1) {
    // Get a user confirmation
    const confirmed = yield call(
      showConfirmation,
      'Multiple ranges will be deleted. Redundant length groups will be removed. Do you wish to continue?'
    );
    // If user declined..
    if (confirmed === false) {
      return;
    }
  }
  // Remove all ranges.
  yield put(
    rangeMutations(
      ranges.map(id => ({ type: 'DELETE_RANGE', payload: { id } }))
    )
  );
  yield put(rangeMutations(ranges.map(range => deleteRange(range))));
}

function* currentTimeSideEffects() {
  const selectedBubbles = yield select(getSelectedBubbles);
  // Nope out early if we've not selected anything.
  if (!selectedBubbles.length) {
    return;
  }
  const state = yield select(getState);
  const startPlayingAtEnd = state.project[PROJECT.START_PLAYING_END_OF_SECTION];
  const stopPlayingAtEnd = state.project[PROJECT.STOP_PLAYING_END_OF_SECTION];
  const startTime = selectedBubbles[0][RANGE.START_TIME];
  const endTime = selectedBubbles[selectedBubbles.length - 1][RANGE.END_TIME];

  // Last time stores previous tick time so that we can compare the gap.
  let lastTime = 0;
  // Click stores if we have made a jump in this code, so we can skip it
  // in our checks when trying to identify user clicks.
  // @todo improvement if we can identify different sources of `SET_CURRENT_TIME` then
  //   we can more easily know if the jumps in the time are from human clicks or automated.
  let clicked = false;
  // We want to listen for every tick of the time.
  while (true) {
    const {
      payload: { currentTime },
    } = yield take(SET_CURRENT_TIME);

    // This logic is for cancelling the listener to the current time.
    if (
      clicked === false &&
      lastTime &&
      Math.abs(currentTime - lastTime) >= 1000
    ) {
      // If the user skips more than a second
      break;
    }
    // Reset the clicked value if set.
    if (clicked) {
      clicked = false;
    }

    // Set a new last time, since we're done using it.
    lastTime = currentTime;

    // When the time goes past the end of a section
    if (currentTime >= endTime) {
      if (startPlayingAtEnd) {
        // Set a clicked value so we know to skip the user click check.
        clicked = true;
        // Either we start playing from the beginning of the section.
        yield put(setCurrentTime(startTime));
      } else if (stopPlayingAtEnd) {
        // Or we pause.
        yield put(pause());
      }
    }
  }
}

function* splitRange({ payload: { time } }) {
  const ranges = yield select(getRangeList);
  const itemToSplit = Object.values(ranges)
    .filter(
      bubble =>
        time <= bubble[RANGE.END_TIME] && time >= bubble[RANGE.START_TIME]
    )
    .sort((b1, b2) => b1[RANGE.DEPTH] - b2[RANGE.DEPTH])[0];
  const endTime = itemToSplit[RANGE.END_TIME];

  // If we wanted to implement split left, so that a new bubble would be created on the left side
  // yield put(updateRangeTime(itemToSplit.id, { startTime }));
  // yield put(createRange({ startTime, endTime: time }));
  yield put(
    rangeMutations([
      createRange({ startTime: time, endTime }),
      updateRangeTime(itemToSplit.id, { endTime: time }),
    ])
  );
}

function* groupRanges(action) {
  // Marks all selection actions as not selected.
  // Creates new range between them.

  const selectedRangeIds = yield select(getSelectedRanges);
  if (selectedRangeIds.length < 2) {
    // We need 2 ranges to group them.
    return;
  }

  const selectedRanges = yield select(getRangesByIds(selectedRangeIds));
  const startTime = selectedRanges.reduce(
    (cur, next) => (next.startTime <= cur ? next.startTime : cur),
    Infinity
  );
  const endTime = selectedRanges.reduce(
    (cur, next) => (next.endTime >= cur ? next.endTime : cur),
    0
  );

  if (!canMerge(yield select(getRangeList), { startTime, endTime })) {
    console.log(`We can't merge these bubbles.`);
    return;
  }

  const getParentBubbles = child => state => {
    return Object.values(getRangeList(state))
      .filter(range => {
        if (
          range.startTime >= child.startTime &&
          range.endTime <= child.endTime
        ) {
          return false;
        }

        if (child.startTime >= range.endTime) {
          return false;
        }

        return child.endTime > range.startTime;
      })
      .sort(range => {
        return -(range.startTime - range.endTime);
      });
  };

  const rangeBubbles = yield select(state => {
    return Object.values(getRangeList(state)).filter(range => {
      return range.startTime >= startTime && range.endTime <= endTime;
    });
  });
  const parentBubbles = yield select(getParentBubbles({ startTime, endTime }));
  const topLevelParent = parentBubbles[parentBubbles.length - 1];

  const depth = rangeBubbles.reduce((maxDepth, next) => {
    if (next.depth > maxDepth) {
      return next.depth;
    }
    return maxDepth;
  }, 1);

  const depthChangeMutations = parentBubbles.map(range => ({
    type: 'INCREASE_RANGE_DEPTH',
    payload: { id: range.id, label: range.label },
  }));

  const deselectMutations = selectedRangeIds.map(id => ({
    type: 'DESELECT_RANGE',
    payload: { id },
  }));

  const newRange = createRange({ startTime, endTime, depth: depth + 1 });

  yield put(
    rangeMutations([
      ...deselectMutations,
      ...depthChangeMutations,
      newRange,
      { type: 'SELECT_RANGE', payload: { id: newRange.payload.id } },
    ])
  );

  /*
  const selectedBubbles = Object.values(state).filter(
        bubble => bubble[RANGE.IS_SELECTED]
      );
      if (selectedBubbles.length < 2) {
        return state;
      }
      const unselectBubbles = selectedBubbles.reduce((updates, bubble) => {
        updates[bubble.id] = {
          [RANGE.IS_SELECTED]: {
            $set: false,
          },
        };
        return updates;
      }, {});
      const newGroup = groupBubbles(selectedBubbles);
      newGroup[RANGE.DEPTH] =
        Object.values(state)
          .filter(
            bubble =>
              newGroup[RANGE.START_TIME] <= bubble[RANGE.START_TIME] &&
              newGroup[RANGE.END_TIME] >= bubble[RANGE.END_TIME]
          )
          .reduce(
            (maxDepth, bubble) => Math.max(maxDepth, bubble[RANGE.DEPTH]),
            1
          ) + 1;
      newGroup.colour =
        DEFAULT_COLOURS[newGroup[RANGE.DEPTH] % DEFAULT_COLOURS.length];
      const newDepths = Object.values(state)
        .filter(
          comparedRange =>
            comparedRange[RANGE.START_TIME] <= newGroup[RANGE.START_TIME] &&
            comparedRange[RANGE.END_TIME] >= newGroup[RANGE.END_TIME]
        )
        .sort(
          (a, b) =>
            a[RANGE.END_TIME] -
            a[RANGE.START_TIME] -
            (b[RANGE.END_TIME] - b[RANGE.START_TIME])
        )
        .reduce((depthChanges, bubble, index) => {
          const computedDepth = newGroup[RANGE.DEPTH] + index + 1;
          if (
            bubble.id !== newGroup.id &&
            computedDepth > bubble[RANGE.DEPTH]
          ) {
            depthChanges[bubble.id] = {
              [RANGE.DEPTH]: {
                $set: computedDepth,
              },
            };
            if (DEFAULT_COLOURS.indexOf(bubble[RANGE.COLOUR] !== -1)) {
              depthChanges[bubble.id][RANGE.COLOUR] = {
                $set: DEFAULT_COLOURS[computedDepth % DEFAULT_COLOURS.length],
              };
            }
          }
          return depthChanges;
        }, {});
      return update(state, {
        [newGroup.id]: {
          $set: newGroup,
        },
        ...unselectBubbles,
        ...newDepths,
      });
  */
}

function* selectRange({ payload: { id, isSelected, deselectOthers } }) {
  // TEMPORARY, until the API changes.
  if (isSelected === false) {
    yield put({ type: 'DESELECT_RANGE', payload: { id } });
  }

  // Deselection of ranges.
  if (deselectOthers) {
    const selected = yield select(getSelectedRanges);
    yield* (selected || [])
      .filter(range => range !== id)
      .map(range => put({ type: 'DESELECT_RANGE', payload: { id: range } }));
  }
}

// @todo change DELETE_RANGE to REQUEST_DELETE_RANGE
function* deleteRangeAction({ payload: { id } }) {
  // @todo recalculate range depths.
  yield put({ type: 'DELETE_RANGE', payload: { id } });
}

function* movePointAction({ payload: { originalX, x } }) {
  const ranges = yield select(getRangesAtPoint(originalX));

  const updateRangeTimes = ranges.map(range =>
    range.startTime === originalX
      ? updateRangeTime(range.id, { startTime: x })
      : updateRangeTime(range.id, { endTime: x })
  );

  const toRemove = ranges
    .filter(range => range.startTime === x && range.endTime === x)
    .map(range => ({ type: 'DELETE_RANGE', payload: { id: range.id } }));

  yield put(yield rangeMutations([...updateRangeTimes, ...toRemove]));

  /*
  return update(
        state,
        Object.values(state).reduce((changes, bubble) => {
          if (bubble[RANGE.START_TIME] === action.payload.originalX) {
            if (!changes[bubble.id]) {
              changes[bubble.id] = {};
            }
            changes[bubble.id][RANGE.START_TIME] = {
              $set: action.payload.x,
            };
          }
          if (bubble[RANGE.END_TIME] === action.payload.originalX) {
            if (!changes[bubble.id]) {
              changes[bubble.id] = {};
            }
            changes[bubble.id][RANGE.END_TIME] = {
              $set: action.payload.x,
            };
          }
          if (
            changes[bubble.id] &&
            changes[bubble.id][RANGE.END_TIME] &&
            changes[bubble.id][RANGE.START_TIME]
          ) {
            delete changes[bubble.id];
            if (!changes.$unset) {
              changes.$unset = [bubble.id];
            } else {
              changes.$unset.push(bubble.id);
            }
          }
          return changes;
        }, {})
      );
   */
}

function canMerge(points, { startTime, endTime }) {
  return (
    Object.values(points)
      .filter(bubble => bubble.depth > 1)
      .filter(
        bubble =>
          (bubble.startTime < startTime &&
            startTime < bubble.endTime &&
            bubble.endTime < endTime) ||
          (startTime < bubble.startTime &&
            bubble.startTime < endTime &&
            endTime < bubble.endTime) ||
          (bubble.startTime === startTime && bubble.endTime === endTime)
      ).length === 0
  );
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
  yield takeLatest(SELECT_RANGE, currentTimeSideEffects);
  yield takeEvery(SPLIT_RANGE_AT, splitRange);
  yield takeEvery(GROUP_RANGES, groupRanges);
  yield takeEvery(SELECT_RANGE, selectRange);
  yield takeEvery(DELETE_RAGE, deleteRangeAction);
  yield takeEvery(MOVE_POINT, movePointAction);
  // yield takeEvery(CREATE_RANGE, createRange);
}
