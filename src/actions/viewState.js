import {
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

export const play = () => ({
  type: PLAY_AUDIO,
});

export const pause = () => ({
  type: STOP_AUDIO,
});

export const zoomIn = () => ({
  type: ZOOM_IN,
});

export const zoomOut = () => ({
  type: ZOOM_OUT,
});

export const resetZoom = () => ({
  type: RESET_ZOOM,
});

export const panToPosition = time => ({
  type: PAN_TO_POSITION,
  payload: {
    x: time,
  },
});

export const showImportModal = () => ({
  type: SHOW_IMPORT_MODAL,
});

export const dismissImportModal = () => ({
  type: DISMISS_IMPORT_MODAL,
});

export const showSettingsModal = () => ({
  type: SHOW_SETTINGS_MODAL,
});

export const dismissSettingsModal = () => ({
  type: DISMISS_SETTINGS_MODAL,
});

export const nextBubble = () => ({
  type: NEXT_BUBBLE,
});

export const previousBubble = () => ({
  type: PREVIOUS_BUBBLE,
});

export const fastForward = () => ({
  type: FAST_FORWARD,
});

export const fastReward = () => ({
  type: FAST_REWARD,
});

export const setVolume = volume => ({
  type: SET_VOLUME,
  payload: {
    volume,
  },
});

export const setCurrentTime = time => ({
  type: SET_CURRENT_TIME,
  payload: {
    currentTime: time,
  },
});

export const loadViewState = state => ({
  type: LOAD_VIEW_STATE,
  state,
});
