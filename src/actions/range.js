import {
  SPLIT_RANGE_AT,
  GROUP_RANGES,
  SELECT_RANGE,
  UPDATE_RANGE,
  MOVE_POINT,
  DELETE_RANGE,
  LOAD_RANGES,
  UPDATE_RANGE_TIME,
  CREATE_RANGE,
  RANGE_MUTATION,
  SCHEDULE_DELETE_RANGES,
  SCHEDULE_DELETE_RANGE,
  DESELECT_RANGE,
  INCREASE_RANGE_DEPTH,
  DECREASE_RANGE_DEPTH,
  IMPORT_RANGES,
  SCHEDULE_UPDATE_RANGE,
  UNSET_RANGE_COLOR,
} from '../constants/range';
import { internal } from '../utils/internal-action';
import generateId from '../utils/generateId';

export const splitRangeAt = time => ({
  type: SPLIT_RANGE_AT,
  payload: {
    time,
  },
});

export const rangeMutations = mutations => ({
  type: RANGE_MUTATION,
  mutations,
});

export const groupSelectedRanges = () => ({
  type: GROUP_RANGES,
});

export const selectRange = (id, deselectOthers) => ({
  type: SELECT_RANGE,
  payload: { id, deselectOthers },
});

export const increaseRangeDepth = (id, factor = 1) => ({
  type: INCREASE_RANGE_DEPTH,
  payload: { id, factor },
});

export const decreaseRangeDepth = id => ({
  type: DECREASE_RANGE_DEPTH,
  payload: { id },
});

export const importRanges = ranges => ({
  type: IMPORT_RANGES,
  payload: { ranges },
});

export const deselectRange = id => ({
  type: DESELECT_RANGE,
  payload: { id },
});

export const createRange = props => ({
  type: CREATE_RANGE,
  payload: { id: generateId(), ...props },
});

export const updateRangeTime = (
  id,
  { startTime, endTime },
  undoable = true
) => ({
  type: undoable ? UPDATE_RANGE_TIME : internal(UPDATE_RANGE_TIME),
  payload: { id, startTime, endTime },
});

export const updateRange = (
  id,
  { label, summary, startTime, endTime, colour, whiteText },
  schedule = true
) => ({
  type: schedule ? SCHEDULE_UPDATE_RANGE : UPDATE_RANGE,
  payload: {
    id,
    label,
    summary,
    startTime,
    endTime,
    colour,
    whiteText,
  },
});

/**
 * @deprecated
 */
export const movePoint = (x, originalX) => ({
  type: MOVE_POINT,
  payload: {
    x,
    originalX,
  },
});

export const deleteRange = id => ({
  type: DELETE_RANGE,
  payload: { id },
});

export const scheduleDeleteRange = id => ({
  type: SCHEDULE_DELETE_RANGE,
  payload: { id },
});

export const scheduleDeleteRanges = ranges => ({
  type: SCHEDULE_DELETE_RANGES,
  payload: { ranges },
});

export const unsetRangeColor = id => ({
  type: UNSET_RANGE_COLOR,
  payload: { id },
});

/**
 * @deprecated
 */
export const loadRanges = ranges => ({
  type: LOAD_RANGES,
  ranges,
});
