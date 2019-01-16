import {
  SPLIT_RANGE_AT,
  GROUP_RANGES,
  SELECT_RANGE,
  UPDATE_RANGE,
  MOVE_POINT,
  DELETE_RAGE,
  DELETE_RAGES,
  LOAD_RANGES,
  DELETE_REDUNDANT_SIZES,
  UPDATE_DEPTHS_AFTER_DELETE,
  UPDATE_RANGE_TIME,
  CREATE_RANGE,
} from '../constants/range';
import { internal } from '../utils/internal-action';
import generateId from '../utils/generateId';

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

export const createRange = ({ startTime, endTime, splits }) => ({
  type: CREATE_RANGE,
  payload: { id: generateId(), startTime, endTime, splits },
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
  { label, summary, startTime, endTime, colour, whiteText }
) => ({
  type: UPDATE_RANGE,
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

export const deleteRanges = ranges => ({
  type: DELETE_RAGES,
  ranges,
});

export const deleteRedundantSizes = () => ({
  type: DELETE_REDUNDANT_SIZES,
});

export const updateDepthsAfterDelete = () => ({
  type: UPDATE_DEPTHS_AFTER_DELETE,
});

export const loadRanges = ranges => ({
  type: LOAD_RANGES,
  ranges,
});
