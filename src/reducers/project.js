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
} from '../constants/project';

const project = (state = DEFAULT_PROJECT_STATE, action) => {
  switch (action.type) {
    case UPDATE_SETTINGS:
      return update(state, {
        bubblesStyle: {
          $set: action.payload.bubblesStyle,
        },
        blackAndWhite: {
          $set: action.payload.blackAndWhite,
        },
        showTimes: {
          $set: action.payload.showTimes,
        },
        autoScaleHeightOnResize: {
          $set: action.payload.autoScaleHeightOnResize,
        },
        startPlayingWhenBubbleIsClicked: {
          $set: action.payload.startPlayingWhenBubbleIsClicked,
        },
        stopPlayingAtTheEndOfSection: {
          $set: action.payload.stopPlayingAtTheEndOfSection,
        },
        bubbleHeight: {
          $set: action.payload.bubbleHeight,
        },
      });
    case SET_LANGUAGE:
      return update(state, {
        language: action.payload.language,
      });
    case SET_TITLE:
      return update(state, {
        title: action.payload.title,
      });

    case SET_DESCRIPTION:
      return update(state, {
        title: action.payload.description,
      });
    case RESET_DOCUMENT:
      return update(state, {
        bubblesStyle: {
          $set: DEFAULT_PROJECT_STATE.bubblesStyle,
        },
        blackAndWhite: {
          $set: DEFAULT_PROJECT_STATE.blackAndWhite,
        },
        showTimes: {
          $set: DEFAULT_PROJECT_STATE.showTimes,
        },
        autoScaleHeightOnResize: {
          $set: DEFAULT_PROJECT_STATE.autoScaleHeightOnResize,
        },
        startPlayingWhenBubbleIsClicked: {
          $set: DEFAULT_PROJECT_STATE.startPlayingWhenBubbleIsClicked,
        },
        stopPlayingAtTheEndOfSection: {
          $set: DEFAULT_PROJECT_STATE.stopPlayingAtTheEndOfSection,
        },
        bubbleHeight: {
          $set: DEFAULT_PROJECT_STATE.bubbleHeight,
        },
        title: {
          $set: DEFAULT_PROJECT_STATE.title,
        },
        description: {
          $set: DEFAULT_PROJECT_STATE.description,
        },
      });
    case LOAD_PROJECT:
      return action.state;
    case EXPORT_DOCUMENT:
    default:
      return state;
  }
};

export default project;
