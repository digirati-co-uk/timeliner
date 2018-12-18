import update from 'immutability-helper';
import {
  DEFAULT_VIEWSTATE_STATE,
  PLAY_AUDIO,
  STOP_AUDIO,
  ZOOM_IN,
  ZOOM_OUT,
  RESET_ZOOM,
  PAN_TO_POSITION,
  SHOW_IMPORT_MODAL,
  DISMISS_IMPORT_MODAL,
  SHOW_SETTINGS_MODAL,
  DISMISS_SETTINGS_MODAL,
  NEXT_BUBBLE,
  PREVIOUS_BUBBLE,
  FAST_FORWARD,
  FAST_REWARD,
  SET_VOLUME,
  SET_CURRENT_TIME,
  LOAD_VIEW_STATE,
  EDIT_METADATA,
  VIEWSTATE,
  OPEN_CONFIRM_DIALOG,
  CLOSE_CONFIRM_DIALOG,
  CONFIRM_YES,
  CONFIRM_NO,
  EDIT_PROJECT_METADATA,
  CANCEL_PROJECT_METADATA_EDITS,
  SAVE_PROJECT_METADATA,
  FINISHED_PLAYING,
  LOAD_SOURCE,
} from '../constants/viewState';

import { AUDIO_LOADING } from '../constants/canvas';

const viewState = (state = DEFAULT_VIEWSTATE_STATE, action) => {
  switch (action.type) {
    case AUDIO_LOADING:
      return update(state, {
        [VIEWSTATE.RUNTIME]: {
          $set: action.payload.duration,
        },
      });
    case PLAY_AUDIO:
      return update(state, {
        [VIEWSTATE.IS_PLAYING]: {
          $set: true,
        },
      });
    case STOP_AUDIO:
      return update(state, {
        [VIEWSTATE.IS_PLAYING]: {
          $set: false,
        },
      });
    case ZOOM_IN:
      return update(state, {
        [VIEWSTATE.ZOOM]: {
          $set: state.zoom * 1.2,
        },
      });
    case ZOOM_OUT:
      return update(state, {
        [VIEWSTATE.ZOOM]: {
          $set: Math.max(state.zoom * 0.8, 1.0),
        },
      });
    case RESET_ZOOM:
      return update(state, {
        [VIEWSTATE.ZOOM]: {
          $set: 1.0,
        },
        [VIEWSTATE.X]: {
          $set: 0.0,
        },
      });
    case PAN_TO_POSITION:
      return update(state, {
        [VIEWSTATE.X]: {
          $set: action.payload.x,
        },
      });
    case SHOW_IMPORT_MODAL:
      return update(state, {
        [VIEWSTATE.IS_IMPORT_OPEN]: {
          $set: true,
        },
      });
    case DISMISS_IMPORT_MODAL:
      return update(state, {
        [VIEWSTATE.IS_IMPORT_OPEN]: {
          $set: false,
        },
      });
    case SHOW_SETTINGS_MODAL:
      return update(state, {
        [VIEWSTATE.IS_SETTINGS_OPEN]: {
          $set: true,
        },
      });
    case DISMISS_SETTINGS_MODAL:
      return update(state, {
        [VIEWSTATE.IS_SETTINGS_OPEN]: {
          $set: false,
        },
      });
    case SET_VOLUME:
      return update(state, {
        [VIEWSTATE.VOLUME]: {
          $set: action.payload.volume,
        },
      });
    case SET_CURRENT_TIME:
      return update(state, {
        [VIEWSTATE.CURRENT_TIME]: {
          $set: action.payload.currentTime || 0,
        },
      });
    case FAST_FORWARD:
      return update(state, {
        [VIEWSTATE.CURRENT_TIME]: {
          $set: Math.min(state.currentTime + 5000, state.runTime),
        },
      });
    case FAST_REWARD:
      return update(state, {
        [VIEWSTATE.CURRENT_TIME]: {
          $set: Math.max(state.currentTime - 5000, 0),
        },
      });
    case LOAD_VIEW_STATE:
      return update(DEFAULT_VIEWSTATE_STATE, {
        $merge: action.state,
      });
    case LOAD_SOURCE:
      return update(state, {
        [VIEWSTATE.SOURCE]: {
          $set: action.payload.source,
        },
      });
    case EDIT_METADATA:
      return update(state, {
        [VIEWSTATE.METADATA_TO_EDIT]: {
          $set: action.rangeId,
        },
      });
    case OPEN_CONFIRM_DIALOG:
      return update(state, {
        [VIEWSTATE.VERIFY_DIALOG]: {
          open: {
            $set: true,
          },
          title: {
            $set: action.title,
          },
        },
      });
    case CLOSE_CONFIRM_DIALOG:
      return update(state, {
        [VIEWSTATE.VERIFY_DIALOG]: {
          open: {
            $set: false,
          },
        },
      });
    case EDIT_PROJECT_METADATA:
      return update(state, {
        [VIEWSTATE.PROJECT_METADATA_EDITOR_OPEN]: {
          $set: true,
        },
      });
    case CANCEL_PROJECT_METADATA_EDITS:
      return update(state, {
        [VIEWSTATE.PROJECT_METADATA_EDITOR_OPEN]: {
          $set: false,
        },
      });
    case FINISHED_PLAYING:
      return update(state, {
        [VIEWSTATE.IS_PLAYING]: {
          $set: false,
        },
      });
    case SAVE_PROJECT_METADATA:
    case CONFIRM_YES:
    case CONFIRM_NO:
    case NEXT_BUBBLE:
    case PREVIOUS_BUBBLE:
    default:
      return state;
  }
};

export default viewState;
