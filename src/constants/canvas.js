const DEFAULT_AUDIO = 'https://webaudioapi.com/samples/audio-tag/chrono.mp3';

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
