import update from 'immutability-helper';
import {
  DEFAULT_PROJECT_STATE,
  UPDATE_SETTINGS,
  SET_LANGUAGE,
  SET_TITLE,
  SET_DESCRIPTION,
  RESET_DOCUMENT,
  EXPORT_DOCUMENT,
  LOAD_PROJECT,
  PROJECT, IMPORT_ERROR,
} from '../constants/project';

const project = (state = DEFAULT_PROJECT_STATE, action) => {
  switch (action.type) {
    case UPDATE_SETTINGS:
      return update(state, {
        $merge: action.payload,
      });
    case SET_LANGUAGE:
      return update(state, {
        [PROJECT.LANGUAGE]: {
          $set: action.payload.language,
        },
      });
    case SET_TITLE:
      return update(state, {
        [PROJECT.TITLE]: {
          $set: action.payload.title,
        },
      });

    case SET_DESCRIPTION:
      return update(state, {
        [PROJECT.DESCRIPTION]: {
          $set: action.payload.description,
        },
      });
    case IMPORT_ERROR:
      return update(state, {
        error: { $set: action.payload.error },
      });
    case RESET_DOCUMENT:
      return state;
    case LOAD_PROJECT:
      return update(
        update(
          {},
          {
            $merge: DEFAULT_PROJECT_STATE,
          }
        ),
        {
          $merge: action.state,
        }
      );
    case EXPORT_DOCUMENT:
    default:
      return state;
  }
};

export default project;
