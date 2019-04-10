import {
  put,
  takeEvery,
  select,
  call,
  take,
  takeLatest,
  all,
} from 'redux-saga/effects';
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
  getRangesBetweenTimes,
  getRangesByIds,
  getSelectedRanges,
} from '../reducers/range';
import {
  NEXT_BUBBLE,
  PLAY_AUDIO,
  PREVIOUS_BUBBLE,
  SET_CURRENT_TIME,
} from '../constants/viewState';
import {
  DESELECT_RANGE,
  GROUP_RANGES,
  MOVE_POINT,
  SCHEDULE_DELETE_RANGE,
  SCHEDULE_DELETE_RANGES,
  SCHEDULE_UPDATE_RANGE,
  SELECT_RANGE,
  SPLIT_RANGE_AT,
  UPDATE_RANGE,
} from '../constants/range';
import {
  createRange,
  decreaseRangeDepth,
  deleteRange,
  deselectRange,
  increaseRangeDepth,
  rangeMutations,
  selectRange,
  updateRangeTime,
  unsetRangeColor,
} from '../actions/range';
import { PROJECT, CLEAR_CUSTOM_COLORS } from '../constants/project';
import invariant from '../utils/invariant';
import { showConfirmation } from './index';

export const STICKY_BUBBLE_MS = 500;

function* previousBubble() {
  const previousBubbleTime = yield select(getPreviousBubbleStartTime);
  if (Number.isFinite(previousBubbleTime)) {
    yield put(setCurrentTime(previousBubbleTime));
  } else {
    yield put(setCurrentTime(0));
  }
}

function* nextBubble() {
  const nextBubbleTime = yield select(getNextBubbleStartTime);
  yield put(setCurrentTime(nextBubbleTime.time));
}

const getCurrentTime = state => state.viewState.currentTime;

/**
 * Can points merge
 *
 * Given a list of points and a start and end time this will
 * return true if the bubbles can be grouped.
 *
 * This is to avoid intersecting bubbles, which is not allowed.
 *
 * @param points
 * @param startTime
 * @param endTime
 * @returns {boolean}
 */
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
export function getStickyPointDelta(ranges, x, sticky) {
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
 * Sort ranges by depth then time.
 *
 * Sort them first by depth, and then by endTime.
 *
 * This will give an order where parents always come before their
 * children AND they are still ordered by time.
 *
 * @param a
 * @param b
 * @returns {number}
 */
function sortRangesByDepthThenTime(a, b) {
  // First by depth, if they are different from each other.
  if (b.depth !== a.depth) {
    return b.depth - a.depth;
  }

  // Then by end time.
  if (a.endTime < b.endTime) {
    return -1;
  }
  if (a.endTime > b.endTime) {
    return 1;
  }

  // This shouldn't happen, if they share an end time AND depth, its
  // not a valid bubble.
  return 0;
}

/**
 * Get direct children
 *
 * Given a list of all the children of a grouping bubble, this will
 * return only the DIRECT children.
 *
 * @param childrenRanges
 * @returns {*}
 */
function getDirectChildren(childrenRanges) {
  return childrenRanges.sort(sortRangesByDepthThenTime).reduce(
    (ac, n) => {
      // Does it start first in range.
      const isMin = n.startTime < ac.min;
      // Is furthest reaching in range.
      const isMax = n.endTime > ac.max;
      // Record the min and max.
      if (isMin) {
        ac.min = n.startTime;
      }
      if (isMax) {
        ac.max = n.endTime;
      }
      // If we've just established a new min or max, push it on our list.
      if (isMin || isMax) {
        ac.list.push(n);
      }
      // Return the state.
      return ac;
    },
    { min: Infinity, max: 0, list: [] }
  ).list;
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
    .sort((a, b) => (a.depth === b.depth ? 0 : a.depth < b.depth ? -1 : 1))
    .reduce((acc, next) => {
      // Filter to only include children inside the current range.
      const filteredChildren = allRanges.filter(
        range =>
          // Not already removed
          acc.indexOf(range.id) === -1 &&
          // Is within the parent bubble.
          bubbleIsWithin(next, range)
      );
      // From the filtered children, filter out only the DIRECT children.
      const directChildren = getDirectChildren(filteredChildren);
      // If there is only one child, we need to remove it.
      if (directChildren.length === 1) {
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

/**
 * Extract times from range list
 *
 * This will take a list of ranges and simply return the smallest start
 * time and the largest end time to get a range.
 *
 * @param ranges
 * @returns {{startTime: *, endTime: *}}
 */
function extractTimesFromRangeList(ranges) {
  const startTime = ranges.reduce(
    (cur, next) => (next.startTime <= cur ? next.startTime : cur),
    Infinity
  );
  const endTime = ranges.reduce(
    (cur, next) => (next.endTime >= cur ? next.endTime : cur),
    0
  );

  return { startTime, endTime };
}

function* getDirectParentRange(range) {
  const parentBubbles = yield select(getParentBubbles(range));
  return parentBubbles.find(parentRange => {
    return (
      parentRange.depth === range.depth + 1 &&
      range.startTime >= parentRange.startTime &&
      range.endTime <= parentRange.endTime
    );
  });
}

function* getSiblingRanges(parentRange, childRange) {
  const rangesBetweenParent = yield select(
    getRangesBetweenTimes(parentRange.startTime, parentRange.endTime)
  );

  return rangesBetweenParent.filter(range => {
    return range.id !== childRange.id && range.id !== parentRange.id;
  });
}

function getRangeToTheLeft(siblingRanges, childRange) {
  return siblingRanges.find(
    range =>
      range.id !== childRange.id &&
      range.depth === childRange.depth &&
      range.endTime === childRange.startTime
  );
}

function getRangeToTheRight(siblingRanges, childRange) {
  return siblingRanges.find(
    range =>
      range.id !== childRange.id &&
      range.depth === childRange.depth &&
      range.startTime === childRange.endTime
  );
}

function overlapBubbleRight(toCover, toGrow) {
  return toGrow.startTime === toCover.endTime
    ? updateRangeTime(toGrow.id, {
        startTime: toCover.startTime,
      })
    : updateRangeTime(toGrow.id, {
        endTime: toCover.startTime,
      });
}

function overlapBubbleLeft(toCover, toGrow) {
  return toGrow.endTime === toCover.startTime
    ? updateRangeTime(toGrow.id, { endTime: toCover.endTime })
    : updateRangeTime(toGrow.id, {
        startTime: toCover.endTime,
      });
}

const getParentBubbles = child => state => {
  return Object.values(getRangeList(state))
    .filter(range => bubbleIsWithin(range, child))
    .sort(range => {
      return -(range.startTime - range.endTime);
    });
};

function canMoveBubbles(bubbleList, toRemove) {
  return bubbleList.filter(range => range.depth === toRemove.depth).length > 0;
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

/**
 * Get range by id
 *
 * Returns a selector for easily getting a single range by id
 * @param id
 * @returns {function(*): *}
 */
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
  if (typeof endTime !== 'undefined' && endTime !== null) {
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
  if (isSelected) {
    if (
      selectedRanges.length &&
      selectedRanges[0] &&
      selectedRanges[0].startTime === ranges[id].startTime
    ) {
      if (state.project[PROJECT.START_PLAYING_WHEN_BUBBLES_CLICKED]) {
        yield put(play());
      }
      yield put(setCurrentTime(ranges[id].startTime));
    }
  } else {
    yield put(pause());
  }
}

export function* currentTimeSaga({ type } = {}) {
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
  const time = yield select(getCurrentTime);

  if ((type === PLAY_AUDIO && time <= startTime) || time >= endTime) {
    return;
  }

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

function* deselectOtherRanges(id) {
  // Deselection of ranges.
  const selected = yield select(getSelectedRanges);

  yield* (selected || [])
    .filter(range => range !== id)
    .map(range => put({ ...deselectRange(range), meta: { fromSaga: true } }));
}

function* deselectAllRangesSaga({ payload }) {
  const selectedRangeIds = yield select(getSelectedRanges);
  // Nope out early if we've not selected anything.
  if (!selectedRangeIds.length) {
    return;
  }
  const selectedRanges = yield select(getRangesByIds(selectedRangeIds));
  const startTime = selectedRanges[0].startTime;
  const state = yield select(s => s);

  if (payload.currentTime === startTime && !state.viewState.isPlaying) return;
  yield call(deselectOtherRanges, null);
}

function* selectRangeSaga({ payload }) {
  if (payload.deselectOthers) {
    yield call(deselectOtherRanges, payload.id);
  }
  yield call(playWhenBubbleIsClicked, payload.id, true);
}

function* deselectRangeSaga({ payload, meta }) {
  if (meta && meta.fromSaga) return;
  yield call(playWhenBubbleIsClicked, payload.id, false);
}

export function* createRangeAction(data) {
  return createRange(data);
}

/**
 * Resolve parents depths
 *
 * Given an initial target depth of a "child" of a set of parents, this will
 * change the parents depth if required, and then recursively to the same
 * to that bubble. It walks all the way up parents parents bumping the size
 * if the parent bubble can no longer fit the child bubble.
 *
 * Return value is an array of depth changes.
 *
 * This is a co-routine that needs the state so it is wrapped in this generator.
 * @param initialDepth
 * @param initialParents
 * @returns {IterableIterator<*>}
 */
function* resolveParentDepths(initialDepth, initialParents) {
  // Request the state.
  const state = yield select();

  // Create a recursive function.
  const depthChangeParents = (childDepth, parents, mutations = []) => {
    // Loop through the parents
    return parents.reduce((acc, range) => {
      // If we "bumped" the child depth by one, would this particular parent still be
      // tall enough to contain this new height.
      if (childDepth + 1 === range.depth) {
        // If not, increase the depth of it
        acc.push(increaseRangeDepth(range.id));
        // Now get its direct parents.
        const parentsParents = getParentBubbles(range)(state);
        // And do the same process, using this ranges depth.
        return depthChangeParents(range.depth, parentsParents, acc);
      }
      // Accumulate all of the mutations.
      return acc;
    }, mutations);
  };

  return depthChangeParents(initialDepth, initialParents);
}

function* groupRangeSaga() {
  // Marks all selection actions as not selected.
  // Creates new range between them.

  const selectedRangeIds = yield select(getSelectedRanges);
  if (selectedRangeIds.length < 2) {
    // We need 2 ranges to group them.
    return;
  }

  const selectedRanges = yield select(getRangesByIds(selectedRangeIds));
  const { startTime, endTime } = extractTimesFromRangeList(selectedRanges);

  if (!canMerge(yield select(getRangeList), { startTime, endTime })) {
    console.log(`We can't merge these bubbles.`);
    return;
  }

  // Get the bubbles inside of the selection.
  const rangeBubbles = yield select(getRangesBetweenTimes(startTime, endTime));

  // Get the parent bubbles for the current range.
  const parentBubbles = yield select(getParentBubbles({ startTime, endTime }));

  // Calculate the tallest bubble in the selection
  const depth = Math.max(...rangeBubbles.map(range => range.depth)) || 1;

  // Calculate any changes to parent bubble depths.
  const depthMutations = yield call(resolveParentDepths, depth, parentBubbles);

  // Deselect currently selected.
  const deselectMutations = selectedRangeIds.map(deselectRange);

  // Create the new range.
  const newRange = yield call(createRangeAction, {
    startTime,
    endTime,
    depth: depth + 1,
  });

  // Put all of the mutations out.
  yield put(
    rangeMutations([
      ...deselectMutations,
      ...depthMutations,
      newRange,
      selectRange(newRange.payload.id),
    ])
  );
}

function* splitRangeSaga({ payload: { time } }) {
  const ranges = yield select(getRangeList);
  const itemToSplit = Object.values(ranges)
    .filter(bubble => time <= bubble.endTime && time >= bubble.startTime)
    .sort((b1, b2) => b1.depth - b2.depth)[0];

  invariant(
    () => itemToSplit && itemToSplit.id && itemToSplit.endTime,
    'Unstable state: There should be a bubble at every point'
  );

  // If we wanted to implement split left, so that a new bubble would be created on the left side
  // yield put(updateRangeTime(itemToSplit.id, { startTime }));
  // yield put(createRange({ startTime, endTime: time }));
  yield put(
    rangeMutations([
      createRange({ startTime: time, endTime: itemToSplit.endTime }),
      updateRangeTime(itemToSplit.id, { endTime: time }),
    ])
  );
}

function* deleteRangeRequest(toRemoveId) {
  const toRemoveIds = [toRemoveId];
  // Removing redundant sizes first
  const redundantSizes = yield call(calculateRedundantSizes, toRemoveIds);

  // Map these Ids to a delete range action.
  const toRemove = redundantSizes.map(deleteRange);

  // Some useful variables.
  const rangeList = yield select(getRangeList);
  const rangeArray = Object.values(rangeList);

  // Create new list of bubbles
  // Run through a validation step to ensure they are of the correct level.
  const remainingRanges = rangeArray
    .filter(range => redundantSizes.indexOf(range.id) === -1 && range.depth > 1)
    .sort((a, b) => (a.depth === b.depth ? 0 : a.depth < b.depth ? -1 : 1));

  const depthMutations = [];
  const newDepthMap = {};

  // Loop through the remaining ranges to calculate depth changes.
  for (const parent of remainingRanges) {
    // Get ALL of the ranges children.
    const rangeChildren = (yield select(
      getRangesBetweenTimes(parent.startTime, parent.endTime)
    )).filter(
      range => range.id !== parent.id && redundantSizes.indexOf(range.id) === -1
    );

    // This is an error case, should not happen.
    if (!rangeChildren.length) continue;

    // Calculate the maximum depth, taking into account any changes made in this loop.
    const maxDepthOfChildren = Math.max(
      ...rangeChildren.map(range => newDepthMap[range.id] || range.depth)
    );

    // Continue if there are no changes.
    if (maxDepthOfChildren + 1 === parent.depth) continue;

    // This indicates we have an incorrect depth,
    if (maxDepthOfChildren + 1 < parent.depth) {
      // Decrease the range if it is too much higher than children.
      newDepthMap[parent.id] = parent.depth - 1;
      depthMutations.push(decreaseRangeDepth(parent.id));
    } else {
      // Increase the range if it can't fit the children anymore.
      newDepthMap[parent.id] = parent.depth + 1;
      depthMutations.push(increaseRangeDepth(parent.id));
    }
  }

  // Make remaining ranges grow right (or left if that's not possible)
  const sizeMutations = [];

  // Loop through all of the deleted ranges.
  for (let deletedId of redundantSizes) {
    // Get the full range object.
    const rangeToRemove = rangeList[deletedId];

    // Need to check if this range has children first, children grow inside so
    // no sibling bubbles will change size in this case.
    const rangeChildren = (yield select(
      getRangesBetweenTimes(rangeToRemove.startTime, rangeToRemove.endTime)
    )).filter(range => range.id !== rangeToRemove.id);

    // No children, no worries.
    if (rangeChildren.length) {
      continue;
    }

    // Get the direct parent of the range.
    const parentRange = yield call(getDirectParentRange, rangeToRemove);
    if (parentRange) {
      const siblingRanges = yield call(
        getSiblingRanges,
        parentRange,
        rangeToRemove
      );

      const lookLeftSibling = getRangeToTheLeft(siblingRanges, rangeToRemove);
      if (lookLeftSibling) {
        sizeMutations.push(
          updateRangeTime(lookLeftSibling.id, {
            endTime: rangeToRemove.endTime,
          })
        );
        continue;
      }

      const lookRightSibling = getRangeToTheRight(siblingRanges, rangeToRemove);
      if (lookRightSibling) {
        sizeMutations.push(
          updateRangeTime(lookRightSibling.id, {
            startTime: rangeToRemove.startTime,
          })
        );
        continue;
      }
    }

    // At this point we know that bubbles inside the parent won't shift to fill the space.
    // First look left to find all the bubbles that share the startTime.
    const leftBubbles = rangeArray.filter(range => {
      return (
        range.id !== rangeToRemove.id &&
        (range.endTime === rangeToRemove.startTime ||
          range.startTime === rangeToRemove.startTime)
      );
    });

    // And queue them up to be moved.
    if (canMoveBubbles(leftBubbles, rangeToRemove) && leftBubbles.length) {
      for (let leftBubble of leftBubbles) {
        // Overlap bubble growing from the left.
        sizeMutations.push(overlapBubbleLeft(rangeToRemove, leftBubble));
      }
      continue;
    }

    // Now we look to the right of the bubble to find bubbles that share
    // the endTime. This is only applicable when there are no bubbles
    // to the left (i.e. a bubble with startTime = 0)
    const rightBubbles = rangeArray.filter(range => {
      return (
        range.id !== rangeToRemove.id &&
        (range.startTime === rangeToRemove.endTime ||
          range.endTime === rangeToRemove.startTime)
      );
    });

    // And queue these up to be moved.
    if (canMoveBubbles(rightBubbles, rangeToRemove) && rightBubbles.length) {
      for (let rightBubble of rightBubbles) {
        // Overlap bubble growing from the right.
        sizeMutations.push(overlapBubbleRight(rangeToRemove, rightBubble));
      }
      // continue;
    }
  }

  yield put(rangeMutations([...toRemove, ...depthMutations, ...sizeMutations]));
}

function* singleDelete({ payload: { id } }) {
  yield call(deleteRangeRequest, id);
}

function* multiDelete({ payload: { ranges } }) {
  if (ranges.length > 1) {
    // Get a user confirmation
    const confirmed = yield call(
      showConfirmation,
      'Multiple sections will be deleted. Redundant sections will be removed. Do you wish to continue?'
    );
    // If user declined..
    if (confirmed === false) {
      return;
    }
  }

  for (let range of ranges) {
    yield call(deleteRangeRequest, range);
  }
}

function* clearCustomColorsSaga() {
  const rangeList = yield select(getRangeList);
  const rangeIds = Object.keys(rangeList);

  for (let rangeId of rangeIds) {
    yield put(unsetRangeColor(rangeId));
  }
}

export default function* rangeSaga() {
  yield all([
    takeEvery(PREVIOUS_BUBBLE, previousBubble),
    takeEvery(NEXT_BUBBLE, nextBubble),
    takeEvery(MOVE_POINT, movePointSaga),
    takeEvery(SCHEDULE_UPDATE_RANGE, saveRangeSaga),
    takeEvery(SELECT_RANGE, selectRangeSaga),
    takeLatest([SELECT_RANGE, DESELECT_RANGE], currentTimeSaga),
    takeEvery(DESELECT_RANGE, deselectRangeSaga),
    takeEvery(GROUP_RANGES, groupRangeSaga),
    takeEvery(SPLIT_RANGE_AT, splitRangeSaga),
    takeEvery(SCHEDULE_DELETE_RANGE, singleDelete),
    takeEvery(SCHEDULE_DELETE_RANGES, multiDelete),
    takeEvery(SET_CURRENT_TIME, deselectAllRangesSaga),
    takeEvery(CLEAR_CUSTOM_COLORS, clearCustomColorsSaga),
  ]);
}
