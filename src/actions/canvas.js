import {
  SET_PLAY_STATE,
  AUDIO_LOADING,
  AUDIO_LOADED,
  CHANGE_AUDIO,
  CHANGE_AUDIO,
  AUDIO_ERROR,
} from '../constants/canvas';

export const audioLoading = (bytesLoaded, bytesTotal, duration) => ({
  action: AUDIO_LOADING,
  payload: {
    percentLoaded: (bytesLoaded / bytesTotal) * 100,
    duration,
  },
});

export const audioLoaded = () => ({
  action: AUDIO_LOADED,
});

export const changeAudio = url => ({
  action: CHANGE_AUDIO,
  payload: {
    url,
  },
});

export const audioError = (code, description) => ({
  action: AUDIO_ERROR,
  payload: {
    code,
    description,
  },
});
