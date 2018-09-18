import {
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

export const play = () => ({
  action: PLAY_AUDIO,
});

export const pause = () => ({
  action: STOP_AUDIO,
});

export const updateCurrentTime = time => ({
  action: UPDATE_CURRENT_TIME,
  payload: {
    currentTime: time,
  },
});

export const zoomIn = () => ({
  action: ZOOM_IN,
});

export const zoomOut = () => ({
  action: ZOOM_OUT,
});

export const resetZoom = () => ({
  action: RESET_ZOOM,
});

export const panToPosition = time => ({
  action: PAN_TO_POSITION,
  payload: {
    x: time,
  },
});

export const showImportModal = () => ({
  action: SHOW_IMPORT_MODAL,
});

export const dismissImportModal = () => ({
  action: DISMISS_IMPORT_MODAL,
});

export const showSettingsModal = () => ({
  action: SHOW_SETTINGS_MODAL,
});

export const dismissSettingsModal = () => ({
  action: DISMISS_SETTINGS_MODAL,
});

export const nextBubble = () => ({
  action: NEXT_BUBBLE,
});

export const previousBubble = () => ({
  action: PREVIOUS_BUBBLE,
});

export const fastForward = () => ({
  action: FAST_FORWARD,
});

export const fastReward = () => ({
  action: FAST_REWARD,
});
