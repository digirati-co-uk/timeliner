export const BUBBLE_STYLE = {
  SQUARE: 'square',
  ROUNDED: 'rounded',
};

const DEFAULT_BUBBLE_HEIGHT = 70;
const DEFAULT_LANGUAGE_CODE = 'en';
const DEFAULT_TITLE = 'Untitled Project';

export const DEFAULT_PROJECT_STATE = {
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

export const UPDATE_SETTINGS = 'UPDATE_SETTINGS';
export const SET_LANGUAGE = 'SET_LANGUAGE';
export const SET_TITLE = 'SET_TITLE';
export const SET_DESCRIPTION = 'SET_DESCRIPTION';
export const RESET_DOCUMENT = 'RESET_DOCUMENT';
export const EXPORT_DOCUMENT = 'EXPORT_DOCUMENT';
export const IMPORT_DOCUMENT = 'IMPORT_DOCUMENT';
