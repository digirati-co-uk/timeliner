import {
  UPDATE_SETTINGS,
  SET_LANGUAGE,
  SET_TITLE,
  SET_DESCRIPTION,
  RESET_DOCUMENT,
} from '../constants/project';

export const updateSettings = form => ({
  action: UPDATE_SETTINGS,
  payload: from,
});

export const setLanguage = language => ({
  action: SET_LANGUAGE,
  payload: {
    language,
  },
});

export const setTitle = title => ({
  action: SET_TITLE,
  payload: {
    title,
  },
});

export const setDescrition = description => ({
  action: SET_DESCRIPTION,
  payload: {
    description,
  },
});

export const resetDocument = () => ({
  action: RESET_DOCUMENT,
});
