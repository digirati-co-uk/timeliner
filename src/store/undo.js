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
  RANGE, RANGE_MUTATION,
} from '../constants/range';
import { setDescription, setLanguage, setTitle } from '../actions/project';
import {
  createRange,
  scheduleDeleteRange,
  movePoint,
  updateRange,
  updateRangeTime,
} from '../actions/range';
import { undo } from '../reducers/range';

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
    [UPDATE_RANGE]: {
      action: (action, range) => ({ type: UPDATE_RANGE, payload: range }),
      createArgs: (state, action) => state.range[action.payload.id],
    },
    [RANGE_MUTATION]: {
      action: (action, undoAction) => undoAction,
      createArgs: (state, action) => undo(state.range, action),
    },
  },
});
