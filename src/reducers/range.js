import update from 'immutability-helper';
import {
  SELECT_RANGE,
  UPDATE_RANGE,
  DELETE_RANGE,
  RANGE,
  UPDATE_RANGE_TIME,
  CREATE_RANGE,
  DEFAULT_RANGE,
  RANGE_MUTATION,
  DESELECT_RANGE,
  IMPORT_RANGES,
  INCREASE_RANGE_DEPTH,
  DECREASE_RANGE_DEPTH,
  SCHEDULE_UPDATE_RANGE,
  UNSET_RANGE_COLOR,
} from '../constants/range';
import {
  createRange,
  decreaseRangeDepth,
  deleteRange,
  increaseRangeDepth,
  rangeMutations,
  updateRange,
  updateRangeTime,
  } from '../actions/range';

const NEW_DEFAULT_RANGES_STATE = {
  selected: [],
  list: {},
};

export function undo(prevState, action) {
  if (action.type === RANGE_MUTATION) {
    return rangeMutations(
      action.mutations.reverse().map(mutation => undo(prevState, mutation))
    );
  }

  const prevResource = action.payload.id
    ? prevState.list[action.payload.id]
    : null;

  if (action.type === INCREASE_RANGE_DEPTH) {
    return decreaseRangeDepth(action.payload.id);
  }
  if (action.type === DECREASE_RANGE_DEPTH) {
    return increaseRangeDepth(action.payload.id);
  }
  if (action.type === UPDATE_RANGE || action.type === SCHEDULE_UPDATE_RANGE) {
    return updateRange(
      action.payload.id,
      Object.keys(action.payload).reduce((acc, key) => {
        acc[key] = prevResource[key];
        return acc;
      }, {}),
      false
    );
  }
  if (action.type === UPDATE_RANGE_TIME) {
    const toRevert = {};
    if (typeof action.payload.startTime !== 'undefined') {
      toRevert.startTime = prevResource.startTime;
    }
    if (typeof action.payload.endTime !== 'undefined') {
      toRevert.endTime = prevResource.endTime;
    }
    return updateRangeTime(action.payload.id, toRevert);
  }

  if (action.type === CREATE_RANGE) {
    return deleteRange(action.payload.id);
  }

  if (action.type === DELETE_RANGE) {
    return createRange(prevResource);
  }

  return {};
}

const range = (state = NEW_DEFAULT_RANGES_STATE, action) => {
  if (action.type === RANGE_MUTATION) {
    return (action.mutations || []).reduce(range, state);
  }
  switch (action.type) {
    case SELECT_RANGE:
      // Don't select if already selected.
      if (state.selected.indexOf(action.payload.id) !== -1) {
        return state;
      }
      // Don't select if it does not exist.
      if (Object.keys(state.list).indexOf(action.payload.id) === -1) {
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
            [RANGE.DEPTH]: { $apply: n => (n === 1 ? 1 : n - 1) },
          },
        },
      });

    case UPDATE_RANGE_TIME:
      if (!state.list[action.payload.id]) {
        console.warn('Cannot update section/range that does not exist', action);
        return state;
      }

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
          },
        },
      });

    case DELETE_RANGE:
      return update(state, {
        list: { $unset: [action.payload.id] },
      });

    case IMPORT_RANGES:
      if (Array.isArray(action.payload.ranges)) {
        return update(state, {
          list: {
            $set: action.payload.ranges.reduce((acc, next) => {
              acc[next.id] = next;
              return acc;
            }, {}),
          },
        });
      }

      return update(state, {
        list: { $set: action.payload.ranges },
      });

    case UNSET_RANGE_COLOR:
      return update(state, {
        list: {
          [action.payload.id]: {
            $unset: [RANGE.COLOUR],
          },
        },
      });

    default:
      return state;
  }
};

export function getRangeList(state) {
  return state.range.list;
}

export function getSelectedRanges(state) {
  return state.range.selected;
}

export function getRangesByIds(rangeIds) {
  return state =>
    rangeIds.map(rangeId => {
      return state.range.list[rangeId];
    });
}

export function getRangesAtPoint(time, sticky = 50) {
  return state =>
    Object.values(state.range.list).filter(
      next =>
        Math.abs(next.startTime - time) <= sticky ||
        Math.abs(next.endTime - time) <= sticky
    );
}

export function getRangesBetweenTimes(startTime, endTime) {
  return state => {
    return Object.values(state.range.list).filter(
      next => next.startTime >= startTime && next.endTime <= endTime
    );
  };
}

export const getNextBubbleStartTime = state => {
  // const currentTime = state.viewState.currentTime;
  // const pointsPastNext = getPoints(state).filter(point => point > currentTime);
  // console.log(pointsPastNext);
  const result = Math.min(
    ...getPoints(state).filter(
      point => point - 250 >= state.viewState.currentTime
    )
  );
  return {
    time: result === Infinity ? state.viewState.runTime + 1 : result + 1,
    doStop: result === Infinity,
  };
};

export const getPreviousBubbleStartTime = state => {
  return Math.max(
    ...getPoints(state).filter(
      point => point + 250 <= state.viewState.currentTime
    )
  );
};

export const getPoints = state =>
  Array.from(
    Object.values(getRangeList(state)).reduce((markers, r) => {
      markers.add(r.startTime);
      markers.add(r.endTime);
      return markers;
    }, new Set([]))
  ).sort();

export default range;
