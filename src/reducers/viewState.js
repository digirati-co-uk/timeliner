import update from 'immutability-helper';
import {
  DEFAULT_VIEWSTATE_STATE,
  PLAY_AUDIO,
  STOP_AUDIO,
  UPDATE_CURRENT_TIME,
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
} from '../constants/viewState';

const viewState = (state = DEFAULT_VIEWSTATE_STATE, action) => {
  switch (action) {
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
    case UPDATE_CURRENT_TIME:
      return update(state, {
        currentTime: {
          $set: action.payload.currentTime,
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
          $set: state.zoom * 0.8,
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
    case NEXT_BUBBLE:
    case PREVIOUS_BUBBLE:
    case FAST_FORWARD:
    case FAST_REWARD:
    default:
      return state;
  }
};

export default viewState;
