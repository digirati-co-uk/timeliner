export const RANGE = {
  START_TIME: 'startTime',
  END_TIME: 'endTime',
  LABEL: 'label',
  SUMMARY: 'summary',
  COLOUR: 'colour',
  DEPTH: 'depth',
  IS_SELECTED: 'isSelected',
  WHITE_TEXT: 'whiteText',
};

export const DEFAULT_COLOURS = [
  '#A63993',
  '#7D3DB0',
  '#3E3D99',
  '#417AB0',
  '#40A6A2',
];

export const DEFAULT_RANGE = {
  [RANGE.START_TIME]: 0,
  [RANGE.END_TIME]: 0,
  [RANGE.LABEL]: '',
  [RANGE.SUMMARY]: '',
  [RANGE.COLOUR]: null,
  [RANGE.DEPTH]: 1,
  [RANGE.IS_SELECTED]: false,
  [RANGE.WHITE_TEXT]: false,
};

export const DEFAULT_RANGES_STATE = {
  'id-0': {
    id: 'id-0',
    ...DEFAULT_RANGE,
  },
};

export const SPLIT_RANGE_AT = 'SPLIT_RANGE_AT';
export const GROUP_RANGES = 'GROUP_RANGES';
export const SELECT_RANGE = 'SELECT_RANGE';
export const UPDATE_RANGE = 'UPDATE_RANGE';
export const UPDATE_RANGE_TIME = 'UPDATE_RANGE_TIME';
export const MOVE_POINT = 'MOVE_POINT';
export const DESELECT_RANGE = 'DESELECT_RANGE';
export const DELETE_RANGE = 'DELETE_RANGE';
export const SCHEDULE_DELETE_RANGE = 'SCHEDULE_DELETE_RANGE';
export const IMPORT_RANGES = 'IMPORT_RANGES';
export const INCREASE_RANGE_DEPTH = 'INCREASE_RANGE_DEPTH';
export const DECREASE_RANGE_DEPTH = 'DECREASE_RANGE_DEPTH';
export const SCHEDULE_DELETE_RANGES = 'SCHEDULE_DELETE_RANGES';
export const LOAD_RANGES = 'LOAD_RANGES';
/** @deprecated */
export const DELETE_REDUNDANT_SIZES = 'DELETE_REDUNDANT_SIZES';
/** @deprecated */
export const UPDATE_DEPTHS_AFTER_DELETE = 'UPDATE_DEPTHS_AFTER_DELETE';
export const CREATE_RANGE = 'CREATE_RANGE';
export const RANGE_MUTATION = 'RANGE_MUTATION';
