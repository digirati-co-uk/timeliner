import { createUndoMiddleware } from 'redux-undo-redo';
import { SAVE_PROJECT_METADATA } from '../constants/viewState';
import { SET_DESCRIPTION, SET_LANGUAGE, SET_TITLE } from '../constants/project';
import {
  DELETE_RANGE,
  DELETE_RANGES,
  GROUP_RANGES,
  MOVE_POINT,
  SPLIT_RANGE_AT,
  UPDATE_RANGE,
  UPDATE_RANGE_TIME,
  CREATE_RANGE,
  RANGE,
} from '../constants/range';
import { setDescription, setLanguage, setTitle } from '../actions/project';
import {
  createRange,
  scheduleDeleteRange,
  movePoint,
  updateRange,
  updateRangeTime,
} from '../actions/range';

const undoActions = [
  // Done
  SET_TITLE,
  SET_DESCRIPTION,
  SET_LANGUAGE,
  MOVE_POINT,
  UPDATE_RANGE,

  // Needs refactor
  SPLIT_RANGE_AT,
  GROUP_RANGES,

  // @todo
  DELETE_RANGE,
  DELETE_RANGES,

  // For consideration.
  SAVE_PROJECT_METADATA,
];

export default createUndoMiddleware({
  revertingActions: {
    [SET_TITLE]: {
      action: (action, title) => setTitle(title),
      createArgs: state => state.project.title,
    },
    [SET_DESCRIPTION]: {
      action: (action, description) => setDescription(description),
      createArgs: state => state.project.description,
    },
    [SET_LANGUAGE]: {
      action: (action, language) => setLanguage(language),
      createArgs: state => state.project.language,
    },
    [MOVE_POINT]: action =>
      movePoint(action.payload.originalX, action.payload.x),
    [UPDATE_RANGE]: {
      action: (action, range) => updateRange(range.id, range),
      createArgs: (state, action) => state.range[action.payload.id],
    },
    [UPDATE_RANGE_TIME]: {
      action: (action, { startTime, endTime }) =>
        updateRangeTime(action.payload.id, { startTime, endTime }),
      createArgs: (state, action) => state.range[action.payload.id],
    },
    [DELETE_RANGE]: {
      action: (action, range) => {
        return {
          type: CREATE_RANGE,
          payload: range,
        };
      },
      createArgs: (state, action) => {
        const oldRange = state.range[action.payload.id];
        const rangeToSplitAr = Object.values(state.range)
          .filter(range => {
            return (
              range.endTime === oldRange.startTime ||
              range.startTime === oldRange.endTime
            );
          })
          .sort((b1, b2) => b1[RANGE.DEPTH] - b2[RANGE.DEPTH]);
        const rangeToSplit = rangeToSplitAr.length
          ? rangeToSplitAr[0].id
          : null;

        return {
          ...state.range[action.payload.id],
          splits: rangeToSplit,
        };
      },
    },
    [CREATE_RANGE]: action => {
      return scheduleDeleteRange(action.payload.id);
    },
  },
});
