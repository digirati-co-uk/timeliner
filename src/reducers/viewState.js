import update from 'immutability-helper';
import {
  DEFAULT_VIEWSTATE_STATE,
  PLAY_AUDIO,
  STOP_AUDIO,
  ZOOM_IN,
  ZOOM_OUT,
  RESET_ZOOM,
  PAN_TO_POSITION,
  SHOW_IMPORT_MODAL,
  DISMISS_IMPORT_MODAL,
  SHOW_SETTINGS_MODAL,
  DISMISS_SETTINGS_MODAL,
  NEXT_BUBBLE,
  PREVIOUS_BUBBLE,
  FAST_FORWARD,
  FAST_REWARD,
  SET_VOLUME,
  SET_CURRENT_TIME,
  LOAD_VIEW_STATE,
} from '../constants/viewState';

import { AUDIO_LOADING } from '../constants/canvas';

const viewState = (state = DEFAULT_VIEWSTATE_STATE, action) => {
  switch (action.type) {
    case AUDIO_LOADING:
      return update(state, {
        runTime: {
          $set: action.payload.duration,
        },
      });
    case PLAY_AUDIO:
      return update(state, {
        isPlaying: {
          $set: true,
        },
      });
    case STOP_AUDIO:
      return update(state, {
        isPlaying: {
          $set: false,
        },
      });
    case ZOOM_IN:
      return update(state, {
        zoom: {
          $set: state.zoom * 1.2,
        },
      });
    case ZOOM_OUT:
      return update(state, {
        zoom: {
          $set: Math.max(state.zoom * 0.8, 1.0),
        },
      });
    case RESET_ZOOM:
      return update(state, {
        zoom: {
          $set: 1.0,
        },
      });
    case PAN_TO_POSITION:
      return update(state, {
        x: {
          $set: action.payload.x,
        },
      });
    case SHOW_IMPORT_MODAL:
      return update(state, {
        isImportOpen: {
          $set: true,
        },
      });
    case DISMISS_IMPORT_MODAL:
      return update(state, {
        isImportOpen: {
          $set: false,
        },
      });
    case SHOW_SETTINGS_MODAL:
      return update(state, {
        isSettingsOpen: {
          $set: true,
        },
      });
    case DISMISS_SETTINGS_MODAL:
      return update(state, {
        isSettingsOpen: {
          $set: false,
        },
      });
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
    case NEXT_BUBBLE:
    case PREVIOUS_BUBBLE:
    case FAST_FORWARD:
      return update(state, {
        currentTime: {
          $set: Math.min(state.currentTime + 5000, state.runTime),
        },
      });
    case FAST_REWARD:
      return update(state, {
        currentTime: {
          $set: Math.max(state.currentTime - 5000, 0),
        },
      });
    case LOAD_VIEW_STATE:
      return update(DEFAULT_VIEWSTATE_STATE, {
        $merge: action.state,
      });
    default:
      return state;
  }
};

export default viewState;
