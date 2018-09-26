import update from 'immutability-helper';
import {
  DEFAULT_CANVAS_STATE,
  AUDIO_LOADING,
  AUDIO_LOADED,
  CHANGE_AUDIO,
  AUDIO_ERROR,
  LOAD_CANVAS,
} from '../constants/canvas';

const canvas = (state = DEFAULT_CANVAS_STATE, action) => {
  switch (action.type) {
    case AUDIO_LOADING:
      return update(state, {
        loadingPercent: {
          $set: action.payload.percentLoaded,
        },
        runTime: {
          $set: action.payload.duration,
        },
      });
    case AUDIO_LOADED:
      return update(state, {
        isLoaded: {
          $set: action.payload.isLoaded,
        },
        loadingPercent: {
          $set: 100,
        },
      });
    case CHANGE_AUDIO:
      return update(state, {
        url: {
          $set: action.payload.url,
        },
        isPlaying: {
          $set: false,
        },
        currentTime: {
          $set: 0,
        },
        isLoaded: {
          $set: false,
        },
      });
    case AUDIO_ERROR:
      console.log('AUDIO_ERROR', action);
      return update(state, {
        error: {
          code: {
            $set: action.payload.code,
          },
          description: {
            $set: action.payload.description,
          },
        },
      });
    case LOAD_CANVAS:
      console.log('LOAD_CANVAS', action);
      return update(state, {
        $merge: action.state,
      });
    default:
      return state;
  }
};

export default canvas;
