const BUBBLE_STYLE = {
  SQUARE: 'square',
  ROUNDED: 'rounded',
};

const DEFAULT_BUBBLE_HEIGHT = 70;
const DEFAULT_LANGUAGE_CODE = 'en';
const DEFAULT_TITLE = 'Untitled Project';

const DEFAULT_PROJECT_STATE = {
  bubblesStyle: BUBBLE_STYLE.ROUNDED,
  blackAndWhite: false,
  showTimes: false,
  autoScaleHeightOnResize: false,
  startPlayingWhenBubbleIsClicked: false,
  stopPlayingAtTheEndOfSection: false,
  bubbleHeight: DEFAULT_BUBBLE_HEIGHT,
  language: DEFAULT_LANGUAGE_CODE,
  title: DEFAULT_TITLE,
  description: '',
};

const UPDATE_SETTINGS = 'UPDATE_SETTINGS';
const SET_LANGUAGE = 'SET_LANGUAGE';
const SET_TITLE = 'SET_TITLE';
const SET_DESCRIPTION = 'SET_DESCRIPTION';
const RESET_DOCUMENT = 'RESET_DOCUMENT';
const EXPORT_DOCUMENT = 'EXPORT_DOCUMENT';
const IMPORT_DOCUMENT = 'IMPORT_DOCUMENT';

export default {
  DEFAULT_PROJECT_STATE,
  BUBBLE_STYLE,
  UPDATE_SETTINGS,
  SET_LANGUAGE,
  SET_TITLE,
  SET_DESCRIPTION,
  RESET_DOCUMENT,
  EXPORT_DOCUMENT,
  IMPORT_DOCUMENT,
};
