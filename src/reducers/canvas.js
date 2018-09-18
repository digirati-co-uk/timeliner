import { DEFAULT_CANVAS_STATE } from '../constants/canvas';

const canvas = (state = DEFAULT_CANVAS_STATE, action) => {
  switch (action) {
    case 'SET_CURRENT_TIME':
    case 'SET_IS_PLAYING':
    default:
      return state;
  }
};

export default canvas;
