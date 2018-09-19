const DEFAULT_AUDIO = 'https://webaudioapi.com/samples/audio-tag/chrono.mp3'; = 'DEFAULT_AUDIO = 'https://webaudioapi.com/samples/audio-tag/chrono.mp3';';
const DEFAULT_AUDIO_DURATION = 57.103563 * 1000;

const DEFAULT_CANVAS_STATE = {
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

const SET_CURRENT_TIME = 'SET_CURRENT_TIME';
const SET_PLAY_STATE = 'SET_PLAY_STATE';
const SET_VOLUME = 'SET_VOLUME';
const AUDIO_LOADED = 'AUDIO_LOADED';
const AUDIO_LOADING = 'AUDIO_LOADING';
const CHANGE_AUDIO = 'CHANGE_AUDIO';
const AUDIO_ERROR = 'AUDIO_ERROR';

export default {
  DEFAULT_CANVAS_STATE,
  SET_CURRENT_TIME,
  SET_PLAY_STATE,
  SET_VOLUME,
  AUDIO_LOADED,
  CHANGE_AUDIO,
  AUDIO_ERROR,
  AUDIO_LOADING,
};
