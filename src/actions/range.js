import {
  SPLIT_RANGE_AT,
  GROUP_RANGES,
  SELECT_RANGE,
  UPDATE_RANGE,
  MOVE_POINT,
  DELETE_RAGE,
  LOAD_RANGES,
  DEFAULT_RANGES_STATE,
} from '../constants/range';

export const splitRangeAt = time => ({
  type: SPLIT_RANGE_AT,
  payload: {
    time,
  },
});

export const groupSelectedRanges = () => ({
  type: GROUP_RANGES,
});

export const selectRange = (id, isSelected, deselectOthers = true) => ({
  type: SELECT_RANGE,
  payload: {
    id,
    isSelected,
    deselectOthers,
  },
});

export const updateRange = (
  id,
  { label, summary, startTime, endTime, colour }
) => ({
  type: UPDATE_RANGE,
  payload: {
    id,
    label,
    summary,
    startTime,
    endTime,
    colour,
  },
});

export const movePoint = (x, originalX) => ({
  type: MOVE_POINT,
  payload: {
    x,
    originalX,
  },
});

export const deleteRange = id => ({
  type: DELETE_RAGE,
  payload: {
    id,
  },
});

export const loadRanges = ranges => ({
  type: LOAD_RANGES,
  ranges,
});
