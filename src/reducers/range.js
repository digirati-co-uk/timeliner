import update from 'immutability-helper';
import {
  DEFAULT_RANGES_STATE,
  SPLIT_RANGE_AT,
  GROUP_RANGES,
  SELECT_RANGE,
  UPDATE_RANGE,
  MOVE_POINT,
  DELETE_RANGE,
  LOAD_RANGES,
  RANGE,
  DEFAULT_COLOURS,
  DELETE_REDUNDANT_SIZES,
  UPDATE_DEPTHS_AFTER_DELETE,
  UPDATE_RANGE_TIME,
  CREATE_RANGE,
  DEFAULT_RANGE,
  RANGE_MUTATION,
  DESELECT_RANGE,
  IMPORT_RANGES,
  INCREASE_RANGE_DEPTH,
  DECREASE_RANGE_DEPTH,
} from '../constants/range';
import { internal } from '../utils/internal-action';

const generateNewId = () => `id-${new Date().getTime()}`;
const groupBubbles = selectedBubbles => {
  return selectedBubbles.reduce(
    (group, bubble) => {
      if (group[RANGE.START_TIME] > bubble[RANGE.START_TIME]) {
        group[RANGE.START_TIME] = bubble[RANGE.START_TIME];
      }
      if (group[RANGE.END_TIME] < bubble[RANGE.END_TIME]) {
        group[RANGE.END_TIME] = bubble[RANGE.END_TIME];
      }
      if (group[RANGE.DEPTH] < bubble[RANGE.DEPTH]) {
        group[RANGE.DEPTH] = bubble[RANGE.DEPTH];
      }
      return group;
    },
    {
      id: generateNewId(),
      [RANGE.START_TIME]: Number.MAX_SAFE_INTEGER,
      [RANGE.END_TIME]: Number.MIN_SAFE_INTEGER,
      [RANGE.DEPTH]: -1,
      [RANGE.LABEL]: '',
      [RANGE.SUMMARY]: '',
      [RANGE.COLOUR]: -1,
      [RANGE.IS_SELECTED]: true,
      [RANGE.WHITE_TEXT]: false,
    }
  );
};

const extendAround = (ranges, direction, changes, currentRange) => {
  const extensionProp = direction === -1 ? RANGE.END_TIME : RANGE.START_TIME;
  const comparisonProp = direction === -1 ? RANGE.START_TIME : RANGE.END_TIME;
  const neighbours = ranges.filter(
    bubble => bubble[extensionProp] === currentRange[comparisonProp]
  );
  if (neighbours.length > 0) {
    neighbours.forEach(bubble => {
      changes[bubble.id] = {
        [extensionProp]: {
          $set: currentRange[extensionProp],
        },
      };
    });
  }
};

const NEW_DEFAULT_RANGES_STATE = {
  selected: [],
  list: {},
};

const range = (state = NEW_DEFAULT_RANGES_STATE, action) => {
  if (action.type === RANGE_MUTATION) {
    return (action.payload.mutations || []).reduce(range, state);
  }
  switch (action.type) {
    case SELECT_RANGE:
      // Don't select if already selected.
      if (state.selected.indexOf(action.payload.id) !== -1) {
        return state;
      }
      return update(state, {
        selected: { $push: [action.payload.id] },
      });

    case DESELECT_RANGE:
      // Don't deselect if not in the index.
      if (state.selected.indexOf(action.payload.id) === -1) {
        return state;
      }
      return update(state, {
        selected: {
          $apply: selected => selected.filter(id => id !== action.payload.id),
        },
      });

    case CREATE_RANGE:
      const id = action.payload.id;
      return update(state, {
        list: {
          [id]: {
            $set: {
              ...DEFAULT_RANGE,
              ...action.payload,
            },
          },
        },
      });

    case INCREASE_RANGE_DEPTH:
      return update(state, {
        list: {
          [action.payload.id]: {
            [RANGE.DEPTH]: { $apply: n => n + 1 },
          },
        },
      });

    case DECREASE_RANGE_DEPTH:
      return update(state, {
        list: {
          [action.payload.id]: {
            [RANGE.DEPTH]: { $apply: n => (n === 0 ? 0 : n - 1) },
          },
        },
      });

    case UPDATE_RANGE_TIME:
      return update(state, {
        list: {
          [action.payload.id]: {
            [RANGE.START_TIME]: {
              $set:
                typeof action.payload.startTime !== 'undefined'
                  ? action.payload.startTime
                  : state.list[action.payload.id].startTime,
            },
            [RANGE.END_TIME]: {
              $set:
                typeof action.payload.endTime !== 'undefined'
                  ? action.payload.endTime
                  : state.list[action.payload.id].endTime,
            },
          },
        },
      });

    case UPDATE_RANGE:
      return update(state, {
        list: {
          [action.payload.id]: {
            [RANGE.LABEL]: {
              $set: action.payload.label,
            },
            [RANGE.SUMMARY]: {
              $set: action.payload.summary,
            },
            [RANGE.COLOUR]: {
              $set: action.payload.colour,
            },
            [RANGE.WHITE_TEXT]: {
              $set: action.payload.whiteText,
            },
            [RANGE.START_TIME]: {
              $set:
                typeof action.payload.startTime !== 'undefined'
                  ? action.payload.startTime
                  : state.list[action.payload.id].startTime,
            },
            [RANGE.END_TIME]: {
              $set:
                typeof action.payload.endTime !== 'undefined'
                  ? action.payload.endTime
                  : state.list[action.payload.id].endTime,
            },
          },
        },
      });

    case DELETE_RANGE:
      return update(state, {
        list: { $unset: [action.payload.id] },
      });

    case IMPORT_RANGES:
      return update(state, {
        list: { $set: action.payload.ranges },
      });

    default:
      return state;
  }
};

export function getRangeList(state) {
  return state.range.list;
}

// SELECTORS.
export function getSelectedRanges(state) {
  return state.range.selected;
}

export function getRangesByIds(rangeIds) {
  return state =>
    rangeIds.map(rangeId => {
      return state.range.list[rangeId];
    });
}

export function getRangesAtPoint(time) {
  return state =>
    Object.values(state.range.list).filter(
      next => next.startTime === time || next.endTime === time
    );
}

export function getRangesBetweenTimes(startTime, endTime) {
  return state =>
    Object.values(state.range.list).filter(
      next => next.startTime >= startTime && next.endTime <= endTime
    );
}

export default range;
