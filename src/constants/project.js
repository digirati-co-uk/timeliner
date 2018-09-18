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

export default {
  DEFAULT_PROJECT_STATE,
  BUBBLE_STYLE,
};
