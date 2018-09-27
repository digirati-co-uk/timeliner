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
  PROJECT,
} from '../constants/project';

const project = (state = DEFAULT_PROJECT_STATE, action) => {
  switch (action.type) {
    case UPDATE_SETTINGS:
      return update(state, {
        $merge: action.payload,
      });
    case SET_LANGUAGE:
      return update(state, {
        [PROJECT.LANGUAGE]: action.payload.language,
      });
    case SET_TITLE:
      return update(state, {
        [PROJECT.TITLE]: action.payload.title,
      });

    case SET_DESCRIPTION:
      return update(state, {
        [PROJECT.DESCRIPTION]: action.payload.description,
      });
    case RESET_DOCUMENT:
      return update(
        {},
        {
          $merge: DEFAULT_PROJECT_STATE,
        }
      );
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
