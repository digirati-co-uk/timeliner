import { combineReducers } from 'redux';

import viewState from './viewState';
import project from './project';
import canvas from './canvas';
import range, { newRange } from './range';
import { undoHistoryReducer } from 'redux-undo-redo';

export default combineReducers({
  viewState,
  project,
  canvas,
  range,
  newRange,
  undoHistory: undoHistoryReducer,
});
