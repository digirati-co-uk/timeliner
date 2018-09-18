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
} from '../constants/viewState';

const viewState = (state = DEFAULT_VIEWSTATE_STATE, action) => {
  switch (action) {
    case PLAY_AUDIO:
      return {
        ...state,
        isPlaying: true,
      };
    case STOP_AUDIO:
      return {
        ...state,
        isPlaying: false,
      };
    case UPDATE_CURRENT_TIME:
      return {
        ...state,
        currentTime: action.payload.currentTime,
      };
    case ZOOM_IN:
      return {
        ...state,
        zoom: state.zoom * 1.2,
      };
    case ZOOM_OUT:
      return {
        ...state,
        zoom: state.zoom * 0.8,
      };
    case RESET_ZOOM:
      return {
        ...state,
        zoom: 1.0,
      };
    case PAN_TO_POSITION:
      return {
        ...state,
        x: action.payload.x,
      };
    case SHOW_IMPORT_MODAL:
      return {
        ...state,
        isImportOpen: true,
      };
    case DISMISS_IMPORT_MODAL:
      return {
        ...state,
        isImportOpen: false,
      };
    case SHOW_SETTINGS_MODAL:
      return {
        ...state,
        isSettingsOpen: true,
      };
    case DISMISS_SETTINGS_MODAL:
      return {
        ...state,
        isSettingsOpen: false,
      };
    case NEXT_BUBBLE:
    case PREVIOUS_BUBBLE:
    case FAST_FORWARD:
    case FAST_REWARD:
    default:
      return state;
  }
};

export default viewState;
