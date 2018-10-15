import update from 'immutability-helper';
import {
  DEFAULT_CANVAS_STATE,
  AUDIO_LOADING,
  AUDIO_LOADED,
  AUDIO_ERROR,
  LOAD_CANVAS,
  UNLOAD_AUDIO,
  CANVAS,
} from '../constants/canvas';

const canvas = (state = DEFAULT_CANVAS_STATE, action) => {
  switch (action.type) {
    case AUDIO_LOADING:
      return update(state, {
        [CANVAS.PERCENT_LOADED]: {
          $set: action.payload.percentLoaded,
        },
      });
    case AUDIO_LOADED:
      return update(state, {
        [CANVAS.IS_LOADED]: {
          $set: action.payload.isLoaded,
        },
        [CANVAS.PERCENT_LOADED]: {
          $set: 100,
        },
      });
    case AUDIO_ERROR:
      return update(state, {
        [CANVAS.ERROR]: {
          code: {
            $set: action.payload.code,
          },
          description: {
            $set: action.payload.description,
          },
        },
      });
    case UNLOAD_AUDIO:
      return update(state, {
        [CANVAS.URL]: {
          $set: null,
        },
        [CANVAS.IS_LOADED]: {
          $set: false,
        },
        [CANVAS.PERCENT_LOADED]: {
          $set: 0,
        },
      });
    case LOAD_CANVAS:
      return update(DEFAULT_CANVAS_STATE, {
        $merge: action.state,
      });
    default:
      return state;
  }
};

export default canvas;
