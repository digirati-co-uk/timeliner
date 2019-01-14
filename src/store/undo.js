import { createUndoMiddleware } from 'redux-undo-redo';
import { SAVE_PROJECT_METADATA } from '../constants/viewState';
import { SET_DESCRIPTION, SET_LANGUAGE, SET_TITLE } from '../constants/project';
import {
  DELETE_RAGE,
  DELETE_RAGES,
  GROUP_RANGES,
  MOVE_POINT,
  SPLIT_RANGE_AT,
  UPDATE_RANGE,
} from '../constants/range';
import { setDescription, setLanguage, setTitle } from '../actions/project';
import { movePoint, updateRange } from '../actions/range';

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
  DELETE_RAGE,
  DELETE_RAGES,

  // For consideration.
  SAVE_PROJECT_METADATA,
];

export default createUndoMiddleware({
  revertingActions: {
    SET_TITLE: {
      action: (action, title) => setTitle(title),
      createArgs: state => state.project.title,
    },
    SET_DESCRIPTION: {
      action: (action, description) => setDescription(description),
      createArgs: state => state.project.description,
    },
    SET_LANGUAGE: {
      action: (action, language) => setLanguage(language),
      createArgs: state => state.project.language,
    },
    MOVE_POINT: action => movePoint(action.payload.originalX, action.payload.x),
    UPDATE_RANGE: {
      action: (action, range) => updateRange(range.id, range),
      createArgs: (state, action) => state.range[action.payload.id],
    },
  },
});
