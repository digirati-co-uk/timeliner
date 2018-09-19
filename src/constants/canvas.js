const DEFAULT_AUDIO = 'https://webaudioapi.com/samples/audio-tag/chrono.mp3';
const DEFAULT_AUDIO_DURATION = 57.103563 * 1000;

export const DEFAULT_CANVAS_STATE = {
  url: DEFAULT_AUDIO,
  duration: DEFAULT_AUDIO_DURATION,
  isPlaying: false,
  currentTime: 0,
  isLoaded: false,
  loadingPercent: 0,
  error: {
    code: null,
    description: '',
  },
};

export const SET_CURRENT_TIME = 'SET_CURRENT_TIME';
export const SET_PLAY_STATE = 'SET_PLAY_STATE';
export const SET_VOLUME = 'SET_VOLUME';
export const AUDIO_LOADED = 'AUDIO_LOADED';
export const AUDIO_LOADING = 'AUDIO_LOADING';
export const CHANGE_AUDIO = 'CHANGE_AUDIO';
export const AUDIO_ERROR = 'AUDIO_ERROR';
