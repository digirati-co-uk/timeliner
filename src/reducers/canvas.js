import update from 'immutability-helper';
import {
  DEFAULT_CANVAS_STATE,
  SET_CURRENT_TIME,
  SET_PLAY_STATE,
  SET_VOLUME,
  AUDIO_LOADING,
  AUDIO_LOADED,
  CHANGE_AUDIO,
  AUDIO_ERROR,
} from '../constants/canvas';

const canvas = (state = DEFAULT_CANVAS_STATE, action) => {
  switch (action.type) {
    case SET_VOLUME:
      return update(state, {
        volume: {
          $set: action.payload.volume,
        },
      });
    case SET_CURRENT_TIME:
      return update(state, {
        currentTime: {
          $set: action.payload.currentTime,
        },
      });
    case SET_PLAY_STATE:
      return update(state, {
        isPlaying: {
          $set: action.payload.isPlaying,
        },
      });
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
    default:
      return state;
  }
};

export default canvas;
