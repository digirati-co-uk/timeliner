import { combineReducers } from 'redux';

import viewState from './viewStateReducer';
import project from './project';

const rootReducer = combineReducers({
  viewState: viewState(state.viewState, action),
  project: project(state.project, action),
});

export default rootReducer;
