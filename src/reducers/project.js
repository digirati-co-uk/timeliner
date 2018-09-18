import { DEFAULT_PROJECT_STATE } from '../constants/project';
import canvas from './canvas';
import range from './range';
import { combineReducers } from 'redux';

const project = (state = DEFAULT_PROJECT_STATE, action) => {
  switch (action) {
    case 'UPDATE_SETTINGS':
    case 'SET_LANGUAGE':
    case 'SET_TITLE':
    case 'SET_DESCRIPTION':
    case 'RESET_DOCUMENT':
    case 'EXPORT_DOCUMENT':
    case 'IMPORT_DOCUMENT':
    default:
      return state;
  }
};

export default combineReducers({
  project,
  canvas,
  range,
});
