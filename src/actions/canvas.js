import {
  SET_PLAY_STATE,
  AUDIO_LOADING,
  AUDIO_LOADED,
  CHANGE_AUDIO,
  AUDIO_ERROR,
} from '../constants/canvas';

export const audioLoading = (bytesLoaded, bytesTotal, duration) => ({
  type: AUDIO_LOADING,
  payload: {
    percentLoaded: parseInt((bytesLoaded / bytesTotal) * 100, 10),
    duration,
  },
});

export const audioLoaded = () => ({
  type: AUDIO_LOADED,
});

export const changeAudio = url => ({
  type: CHANGE_AUDIO,
  payload: {
    url,
  },
});

export const audioError = (code, description) => ({
  type: AUDIO_ERROR,
  payload: {
    code,
    description,
  },
});
