import {
  UPDATE_SETTINGS,
  SET_LANGUAGE,
  SET_TITLE,
  SET_DESCRIPTION,
  RESET_DOCUMENT,
} from '../constants/project';

export const updateSettings = form => ({
  type: UPDATE_SETTINGS,
  payload: from,
});

export const setLanguage = language => ({
  type: SET_LANGUAGE,
  payload: {
    language,
  },
});

export const setTitle = title => ({
  type: SET_TITLE,
  payload: {
    title,
  },
});

export const setDescrition = description => ({
  type: SET_DESCRIPTION,
  payload: {
    description,
  },
});

export const resetDocument = () => ({
  type: RESET_DOCUMENT,
});
