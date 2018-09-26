const DEFAULT_AUDIO = ''; //'https://webaudioapi.com/samples/audio-tag/chrono.mp3';

export const DEFAULT_CANVAS_STATE = {
  url: DEFAULT_AUDIO,
  isLoaded: false,
  loadingPercent: 0,
  error: {
    code: null,
    description: '',
  },
};

export const AUDIO_LOADED = 'AUDIO_LOADED';
export const AUDIO_LOADING = 'AUDIO_LOADING';
export const CHANGE_AUDIO = 'CHANGE_AUDIO';
export const AUDIO_ERROR = 'AUDIO_ERROR';
export const SET_CURRENT_TIME = 'SET_CURRENT_TIME';
export const LOAD_CANVAS = 'LOAD_CANVAS';

export const ERROR_CODES = {
  MEDIA_ERR_ABORTED: "Client aborted download at user's request",
  MEDIA_ERR_NETWORK:
    'A network error of some description caused the user agent to stop fetching the media resource, after the resource was established to be usable.',
  MEDIA_ERR_DECODE:
    'An error of some description occurred while decoding the media resource, after the resource was established to be usable.',
  MEDIA_ERR_SRC_NOT_SUPPORTED:
    'Media (audio file) not supported ("not usable.")',
};
