import {
  SPLIT_RANGE_AT,
  GROUP_RANGES,
  ON_SELECT_RANGE,
  UPDATE_RANGE,
  MOVE_POINT,
  DELETE_RAGE,
} from '../constants/range';

export const splitRangeAt = time => ({
  action: SPLIT_RANGE_AT,
  payload: {
    time,
  },
});

export const groupSelectedRanges = () => ({
  action: GROUP_RANGES,
});

export const selectRange = (id, isSelected) => ({
  action: ON_SELECT_RANGE,
  payload: {
    id,
    isSelected,
  },
});

export const updateRange = (
  id,
  { label, summary, startTime, endTime, colour }
) => ({
  action: UPDATE_RANGE,
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
  action: MOVE_POINT,
  payload: {
    x,
    originalX,
  },
});

export const deleteRange = id => ({
  action: DELETE_RAGE,
  payload: {
    id,
  },
});
