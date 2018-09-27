export const VIEWSTATE = {
  RUNTIME: 'runTime',
  IS_PLAYING: 'isPlaying',
  CURRENT_TIME: 'currentTime',
  ZOOM: 'zoom',
  X: 'x',
  IS_IMPORT_OPEN: 'isImportOpen',
  IS_SETTINGS_OPEN: 'isSettingsOpen',
  VOLUME: 'volume',
};

export const DEFAULT_VIEWSTATE_STATE = {
  [VIEWSTATE.RUNTIME]: 0,
  [VIEWSTATE.IS_PLAYING]: false,
  [VIEWSTATE.CURRENT_TIME]: 0,
  [VIEWSTATE.ZOOM]: 1.0,
  [VIEWSTATE.X]: 0,
  [VIEWSTATE.IS_IMPORT_OPEN]: false,
  [VIEWSTATE.IS_SETTINGS_OPEN]: false,
  [VIEWSTATE.VOLUME]: 70,
};

export const PLAY_AUDIO = 'PLAY_AUDIO';
export const STOP_AUDIO = 'STOP_AUDIO';
export const ZOOM_IN = 'ZOOM_IN';
export const ZOOM_OUT = 'ZOOM_OUT';
export const RESET_ZOOM = 'RESET_ZOOM';
export const PAN_TO_POSITION = 'PAN_TO_POSITION';
export const SHOW_IMPORT_MODAL = 'SHOW_IMPORT_MODAL';
export const DISMISS_IMPORT_MODAL = 'DISMISS_IMPORT_MODAL';
export const SHOW_SETTINGS_MODAL = 'SHOW_SETTINGS_MODAL';
export const DISMISS_SETTINGS_MODAL = 'DISMISS_SETTINGS_MODAL';
export const NEXT_BUBBLE = 'NEXT_BUBBLE';
export const PREVIOUS_BUBBLE = 'PREVIOUS_BUBBLE';
export const FAST_FORWARD = 'FAST_FORWARD';
export const FAST_REWARD = 'FAST_REWARD';
export const SET_VOLUME = 'SET_VOLUME';
export const SET_CURRENT_TIME = 'SET_CURRENT_TIME';
export const LOAD_VIEW_STATE = 'LOAD_VIEW_STATE';
