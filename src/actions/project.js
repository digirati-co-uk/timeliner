import {
  UPDATE_SETTINGS,
  SET_LANGUAGE,
  SET_TITLE,
  SET_DESCRIPTION,
  RESET_DOCUMENT,
  IMPORT_DOCUMENT,
  LOAD_PROJECT,
} from '../constants/project';

export const updateSettings = form => ({
  type: UPDATE_SETTINGS,
  payload: form,
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

export const setDescription = description => ({
  type: SET_DESCRIPTION,
  payload: {
    description,
  },
});

export const resetDocument = () => ({
  type: RESET_DOCUMENT,
});

export const importDocument = manifest => ({
  type: IMPORT_DOCUMENT,
  manifest,
});

export const loadProject = state => ({
  type: LOAD_PROJECT,
  state,
});
