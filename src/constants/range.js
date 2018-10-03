export const RANGE = {
  START_TIME: 'startTime',
  END_TIME: 'endTime',
  LABEL: 'label',
  SUMMARY: 'summary',
  COLOUR: 'colour',
  DEPTH: 'depth',
  IS_SELECTED: 'isSelected',
};
export const DEFAULT_COLOURS = [
  '#A63993',
  '#7D3DB0',
  '#3E3D99',
  '#417AB0',
  '#40A6A2',
];
export const DEFAULT_RANGES_STATE = {
  'id-0': {
    id: 'id-0',
    [RANGE.START_TIME]: 0,
    [RANGE.END_TIME]: 0,
    [RANGE.LABEL]: '',
    [RANGE.SUMMARY]: '',
    [RANGE.COLOUR]: DEFAULT_COLOURS[0],
    [RANGE.DEPTH]: 1,
    [RANGE.IS_SELECTED]: false,
  },
};

export const SPLIT_RANGE_AT = 'SPLIT_RANGE_AT';
export const GROUP_RANGES = 'GROUP_RANGES';
export const SELECT_RANGE = 'SELECT_RANGE';
export const UPDATE_RANGE = 'UPDATE_RANGE';
export const MOVE_POINT = 'MOVE_POINT';
export const DELETE_RAGE = 'DELETE_RAGE';
export const LOAD_RANGES = 'LOAD_RANGES';
