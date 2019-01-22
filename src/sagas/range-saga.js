import { put, takeEvery, select, call, take } from 'redux-saga/effects';
import {
  editMetadata,
  pause,
  play,
  setCurrentTime,
} from '../actions/viewState';
import {
  getNextBubbleStartTime,
  getPreviousBubbleStartTime,
  getRangeList,
  getRangesAtPoint,
  getRangesByIds,
  getSelectedRanges,
} from '../reducers/range';
import {
  NEXT_BUBBLE,
  PREVIOUS_BUBBLE,
  SET_CURRENT_TIME,
} from '../constants/viewState';
import {
  DESELECT_RANGE,
  MOVE_POINT,
  RANGE,
  SCHEDULE_UPDATE_RANGE,
  SELECT_RANGE,
  UPDATE_RANGE,
} from '../constants/range';
import { deleteRange, rangeMutations, updateRangeTime } from '../actions/range';
import { PROJECT } from '../constants/project';

export const STICKY_BUBBLE_MS = 50;

function* previousBubble() {
  const previousBubbleTime = yield select(getPreviousBubbleStartTime);
  yield put(setCurrentTime(previousBubbleTime));
}

function* nextBubble() {
  const nextBubbleTime = yield select(getNextBubbleStartTime);
  yield put(setCurrentTime(nextBubbleTime.time));
}

/**
 * Get sticky point delta
 *
 * From a list of ranges and a single point in time this will return
 * the largest delta within `sticky` (default: 50ms) so that you can
 * use it to auto-correct inaccuracy of user pointers.
 *
 * @param ranges
 * @param x
 * @param sticky
 * @returns {T | *}
 */
export function getStickyPointDelta(ranges, x, sticky = 50) {
  return (
    ranges
      .reduce((stickyCandidates, range) => {
        if (Math.abs(range.startTime - x) <= sticky) {
          stickyCandidates.push(range.startTime);
        }
        if (Math.abs(range.endTime - x) <= sticky) {
          stickyCandidates.push(range.endTime);
        }
        return stickyCandidates;
      }, [])
      .filter(r => r > 0)
      .sort((a, b) => Math.abs(x - a) - Math.abs(x - b))
      .pop() || x
  );
}

/**
 * Calculate redundant sizes
 *
 * Asks the question, in the current state of the application, if I
 * removed X bubbles, which bubbles would have to be removed.
 *
 * @param toRemoveIds
 * @returns {IterableIterator<*>}
 */
function* calculateRedundantSizes(toRemoveIds) {
  const allRanges = Object.values(yield select(getRangeList));

  return allRanges
    .filter(range => toRemoveIds.indexOf(range.id) === -1)
    .filter(filterOnlyGroupingRanges)
    .reduce((acc, next) => {
      const childRanges = allRanges.filter(
        range =>
          // Not already removed
          toRemoveIds.indexOf(range.id) === -1 &&
          // Is within the parent bubble.
          bubbleIsWithin(next, range)
      );
      // If there is only one child, we need to remove it.
      if (childRanges.length === 1) {
        acc.push(next.id);
      }
      return acc;
    }, toRemoveIds);
}

/**
 * Filter only grouping ranges
 *
 * This has been split out, it may be expanded later on.
 *
 * @param range
 * @returns {boolean}
 */
function filterOnlyGroupingRanges(range) {
  return range.depth > 1;
}

/**
 * Bubble is withing
 *
 * Filter for two ranges, returns true if `childCandidate` is
 * inside the first range at any level.
 *
 * @param parent
 * @param childCandidate
 * @returns {boolean}
 */
function bubbleIsWithin(parent, childCandidate) {
  return (
    childCandidate.id !== parent.id &&
    childCandidate.startTime >= parent.startTime &&
    childCandidate.endTime <= parent.endTime
  );
}

/**
 * Fuzzy equal.
 *
 * Compares `a` and `b` and returns if they are within
 * STICK_BUBBLE_MS configuration value (default: 50)
 *
 * @param a
 * @param b
 * @returns {boolean}
 */
function fuzzyEqual(a, b) {
  return Math.abs(a - b) <= STICKY_BUBBLE_MS;
}

function* getMovePointMutations(fromTime, toTime) {
  const ranges = yield select(getRangesAtPoint(fromTime, STICKY_BUBBLE_MS));
  const x = getStickyPointDelta(ranges, toTime, STICKY_BUBBLE_MS);

  const toRemoveIds = ranges
    .filter(range => {
      if (fuzzyEqual(range.startTime, fromTime)) {
        return fuzzyEqual(range.endTime, x);
      }
      return fuzzyEqual(range.startTime, x);
    })
    .map(range => range.id);

  // This should be able to be split out.
  const redundantSizes = yield call(calculateRedundantSizes, toRemoveIds);

  const toRemove = redundantSizes.map(deleteRange);

  // When updating range times, need to consider the STICKY_BUBBLE_MS of stickiness.
  const updateRangeTimes = ranges
    .filter(range => redundantSizes.indexOf(range.id) === -1)
    .map(range =>
      fuzzyEqual(range.startTime, fromTime)
        ? updateRangeTime(range.id, { startTime: x })
        : updateRangeTime(range.id, { endTime: x })
    );

  // Finish the mutation.
  return [...updateRangeTimes, ...toRemove];
}

function getRangeById(id) {
  return state => state.range.list[id];
}

function* saveRangeSaga({ payload }) {
  const { startTime, endTime, ...restPayload } = payload;
  const range = yield select(getRangeById(restPayload.id));
  const mutations = [{ type: UPDATE_RANGE, payload: restPayload }];
  if (typeof startTime !== 'undefined' && startTime !== null) {
    const startMutations = yield call(
      getMovePointMutations,
      range.startTime,
      startTime
    );
    startMutations.forEach(mutation => mutations.push(mutation));
  }
  if (typeof endTime !== 'undefined' && startTime !== null) {
    const endMutations = yield call(
      getMovePointMutations,
      range.endTime,
      endTime
    );
    endMutations.forEach(mutation => mutations.push(mutation));
  }

  // Mutations batched together.
  yield put(rangeMutations(mutations));
  // UI doesn't need to be grouped for undo.
  yield put(editMetadata(null));
}

function* movePointSaga({ payload: { originalX, x: newX } }) {
  const mutations = yield call(getMovePointMutations, originalX, newX);
  yield put(rangeMutations(mutations));
}

function* playWhenBubbleIsClicked(id, isSelected) {
  const state = yield select();
  const ranges = yield select(getRangeList);
  const selectedRangeIds = yield select(getSelectedRanges);
  const selectedRanges = yield select(getRangesByIds(selectedRangeIds));
  if (state.project[PROJECT.START_PLAYING_WHEN_BUBBLES_CLICKED]) {
    if (isSelected) {
      if (selectedRanges[0].startTime === ranges[id].startTime) {
        yield put(play());
        yield put(setCurrentTime(ranges[id].startTime));
      }
    } else {
      yield put(pause());
    }
  }
}

export function* currentTimeSideEffects() {
  const state = yield select(s => s.project);
  const startPlayingAtEnd = state.startPlayingAtEndOfSection;
  const stopPlayingAtEnd = state.stopPlayingAtTheEndOfSection;

  const selectedRangeIds = yield select(getSelectedRanges);
  // Nope out early if we've not selected anything.
  if (!selectedRangeIds.length) {
    return;
  }

  const selectedRanges = yield select(getRangesByIds(selectedRangeIds));
  const startTime = selectedRanges[0].startTime;
  const endTime = selectedRanges[selectedRanges.length - 1].endTime;

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

function* selectRangeSaga({ payload }) {
  yield call(playWhenBubbleIsClicked, payload.id, true);
  // yield takeEvery(SELECT_RANGE, selectSideEffects);
  // yield takeLatest(SELECT_RANGE, currentTimeSideEffects);
  // yield takeEvery(SELECT_RANGE, selectRange);
}

function* deselectRangeSaga({ payload }) {
  yield call(playWhenBubbleIsClicked, payload.id, false);
}

export default function* rangeSaga() {
  yield takeEvery(PREVIOUS_BUBBLE, previousBubble);
  yield takeEvery(NEXT_BUBBLE, nextBubble);
  yield takeEvery(MOVE_POINT, movePointSaga);
  yield takeEvery(SCHEDULE_UPDATE_RANGE, saveRangeSaga);
  yield takeEvery(SELECT_RANGE, selectRangeSaga);
  yield takeEvery(DESELECT_RANGE, deselectRangeSaga);
}
