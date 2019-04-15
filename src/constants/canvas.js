const DEFAULT_AUDIO = ''; //'https://webaudioapi.com/samples/audio-tag/chrono.mp3';

export const CANVAS = {
  URL: 'url',
  IS_LOADED: 'isLoaded',
  PERCENT_LOADED: 'loadingPercent',
  ERROR: 'error',
};

export const DEFAULT_CANVAS_STATE = {
  [CANVAS.URL]: DEFAULT_AUDIO,
  [CANVAS.IS_LOADED]: false,
  [CANVAS.PERCENT_LOADED]: 0,
  [CANVAS.ERROR]: {
    code: null,
    description: '',
  },
};

export const AUDIO_LOADED = 'AUDIO_LOADED';
export const AUDIO_LOADING = 'AUDIO_LOADING';
export const AUDIO_ERROR = 'AUDIO_ERROR';
export const SET_CURRENT_TIME = 'SET_CURRENT_TIME';
export const LOAD_CANVAS = 'LOAD_CANVAS';
export const UNLOAD_AUDIO = 'UNLOAD_AUDIO';
export const ERROR_CODES = {
  MEDIA_ERR_ABORTED: 'Download aborted',
  MEDIA_ERR_NETWORK: 'A network error occurred',
  MEDIA_ERR_DECODE: 'An error occurred while decoding the media resource',
  MEDIA_ERR_SRC_NOT_SUPPORTED: 'Media file format not supported',
};
