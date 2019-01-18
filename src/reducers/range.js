import update from 'immutability-helper';
import {
  DEFAULT_RANGES_STATE,
  SPLIT_RANGE_AT,
  GROUP_RANGES,
  SELECT_RANGE,
  UPDATE_RANGE,
  MOVE_POINT,
  DELETE_RAGE,
  LOAD_RANGES,
  RANGE,
  DEFAULT_COLOURS,
  DELETE_REDUNDANT_SIZES,
  UPDATE_DEPTHS_AFTER_DELETE,
  UPDATE_RANGE_TIME,
  CREATE_RANGE,
  DEFAULT_RANGE,
  RANGE_MUTATION,
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

const DESELECT_RANGE = 'DESELECT_RANGE';
const DELETE_RANGE = 'DELETE_RANGE';
const IMPORT_RANGES = 'IMPORT_RANGES';
const INCREASE_RANGE_DEPTH = 'INCREASE_RANGE_DEPTH';
const DECREASE_RANGE_DEPTH = 'DECREASE_RANGE_DEPTH';

export const newRange = (state = NEW_DEFAULT_RANGES_STATE, action) => {
  if (action.type === RANGE_MUTATION) {
    return (action.payload.mutations || []).reduce(newRange, state);
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
  return state.newRange.list;
}

// SELECTORS.
export function getSelectedRanges(state) {
  return state.newRange.selected;
}

export function getRangesByIds(rangeIds) {
  return state =>
    rangeIds.map(rangeId => {
      return state.newRange.list[rangeId];
    });
}

export function getRangesAtPoint(time) {
  return state =>
    Object.values(state.newRange.list).filter(
      next => next.startTime === time || next.endTime === time
    );
}

export function getRangesBetweenTimes(startTime, endTime) {
  return state =>
    Object.values(state.newRange.list).filter(
      next => next.startTime >= startTime && next.endTime <= endTime
    );
}

const range = (state = DEFAULT_RANGES_STATE, action) => {
  if (action.type === RANGE_MUTATION) {
    return (action.payload.mutations || []).reduce(range, state);
  }

  return state;

  switch (action.type) {
    // case SPLIT_RANGE_AT:
    //   const newId = generateNewId();
    //   const splitTime = action.payload.time;
    //   const itemToSplit = Object.values(state)
    //     .filter(
    //       bubble =>
    //         splitTime <= bubble[RANGE.END_TIME] &&
    //         splitTime >= bubble[RANGE.START_TIME]
    //     )
    //     .sort((b1, b2) => b1[RANGE.DEPTH] - b2[RANGE.DEPTH])[0];
    //   const endTime = itemToSplit[RANGE.END_TIME];
    //   return update(state, {
    //     [newId]: {
    //       $set: {
    //         id: newId,
    //         [RANGE.START_TIME]: action.payload.time,
    //         [RANGE.END_TIME]: endTime,
    //         [RANGE.COLOUR]: itemToSplit[RANGE.COLOUR],
    //         [RANGE.DEPTH]: itemToSplit[RANGE.DEPTH], //NOTE: this will be always depth 1...
    //       },
    //     },
    //     [itemToSplit.id]: {
    //       [RANGE.END_TIME]: {
    //         $set: action.payload.time,
    //       },
    //     },
    //   });
    case GROUP_RANGES:
      const selectedBubbles = Object.values(state).filter(
        bubble => bubble[RANGE.IS_SELECTED]
      );
      if (selectedBubbles.length < 2) {
        return state;
      }
      const unselectBubbles = selectedBubbles.reduce((updates, bubble) => {
        updates[bubble.id] = {
          [RANGE.IS_SELECTED]: {
            $set: false,
          },
        };
        return updates;
      }, {});
      const newGroup = groupBubbles(selectedBubbles);
      newGroup[RANGE.DEPTH] =
        Object.values(state)
          .filter(
            bubble =>
              newGroup[RANGE.START_TIME] <= bubble[RANGE.START_TIME] &&
              newGroup[RANGE.END_TIME] >= bubble[RANGE.END_TIME]
          )
          .reduce(
            (maxDepth, bubble) => Math.max(maxDepth, bubble[RANGE.DEPTH]),
            1
          ) + 1;
      newGroup.colour =
        DEFAULT_COLOURS[newGroup[RANGE.DEPTH] % DEFAULT_COLOURS.length];
      const newDepths = Object.values(state)
        .filter(
          comparedRange =>
            comparedRange[RANGE.START_TIME] <= newGroup[RANGE.START_TIME] &&
            comparedRange[RANGE.END_TIME] >= newGroup[RANGE.END_TIME]
        )
        .sort(
          (a, b) =>
            a[RANGE.END_TIME] -
            a[RANGE.START_TIME] -
            (b[RANGE.END_TIME] - b[RANGE.START_TIME])
        )
        .reduce((depthChanges, bubble, index) => {
          const computedDepth = newGroup[RANGE.DEPTH] + index + 1;
          if (
            bubble.id !== newGroup.id &&
            computedDepth > bubble[RANGE.DEPTH]
          ) {
            depthChanges[bubble.id] = {
              [RANGE.DEPTH]: {
                $set: computedDepth,
              },
            };
            if (DEFAULT_COLOURS.indexOf(bubble[RANGE.COLOUR] !== -1)) {
              depthChanges[bubble.id][RANGE.COLOUR] = {
                $set: DEFAULT_COLOURS[computedDepth % DEFAULT_COLOURS.length],
              };
            }
          }
          return depthChanges;
        }, {});
      return update(state, {
        [newGroup.id]: {
          $set: newGroup,
        },
        ...unselectBubbles,
        ...newDepths,
      });
    case SELECT_RANGE:
      return update(
        state,
        Object.values(state).reduce((updates, bubble) => {
          if (action.payload.id === bubble.id) {
            updates[action.payload.id] = {
              [RANGE.IS_SELECTED]: {
                $set: action.payload.isSelected,
              },
            };
          } else if (
            action.payload.deselectOthers &&
            bubble[RANGE.IS_SELECTED]
          ) {
            updates[bubble.id] = {
              [RANGE.IS_SELECTED]: {
                $set: false,
              },
            };
          }
          return updates;
        }, {})
      );

    case internal(UPDATE_RANGE_TIME):
    case UPDATE_RANGE_TIME:
      return update(state, {
        [action.payload.id]: {
          [RANGE.START_TIME]: {
            $set:
              typeof action.payload.startTime !== 'undefined'
                ? action.payload.startTime
                : state[action.payload.id].startTime,
          },
          [RANGE.END_TIME]: {
            $set:
              typeof action.payload.endTime !== 'undefined'
                ? action.payload.endTime
                : state[action.payload.id].endTime,
          },
        },
      });
    case CREATE_RANGE:
      const id = action.payload.id;
      const splits = action.payload.splits;
      const stateWithRange = update(state, {
        [id]: {
          $set: {
            ...DEFAULT_RANGE,
            ...action.payload,
          },
        },
      });

      if (splits) {
        return update(stateWithRange, {
          [splits]: {
            endTime: { $set: action.payload.startTime },
          },
        });
      }
      return stateWithRange;
    case UPDATE_RANGE:
      return update(state, {
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
                : state[action.payload.id].startTime,
          },
          [RANGE.END_TIME]: {
            $set:
              typeof action.payload.endTime !== 'undefined'
                ? action.payload.endTime
                : state[action.payload.id].endTime,
          },
        },
      });
    case MOVE_POINT:
      return update(
        state,
        Object.values(state).reduce((changes, bubble) => {
          if (bubble[RANGE.START_TIME] === action.payload.originalX) {
            if (!changes[bubble.id]) {
              changes[bubble.id] = {};
            }
            changes[bubble.id][RANGE.START_TIME] = {
              $set: action.payload.x,
            };
          }
          if (bubble[RANGE.END_TIME] === action.payload.originalX) {
            if (!changes[bubble.id]) {
              changes[bubble.id] = {};
            }
            changes[bubble.id][RANGE.END_TIME] = {
              $set: action.payload.x,
            };
          }
          if (
            changes[bubble.id] &&
            changes[bubble.id][RANGE.END_TIME] &&
            changes[bubble.id][RANGE.START_TIME]
          ) {
            delete changes[bubble.id];
            if (!changes.$unset) {
              changes.$unset = [bubble.id];
            } else {
              changes.$unset.push(bubble.id);
            }
          }
          return changes;
        }, {})
      );
    case DELETE_RAGE:
      const currentRange = state[action.payload.id];
      const changes = {
        $unset: [action.payload.id],
      };
      if (currentRange.depth === 1) {
        const ranges = Object.values(state);
        const containedBy = ranges
          .filter(
            bubble =>
              bubble[RANGE.DEPTH] > 1 &&
              bubble[RANGE.START_TIME] <= currentRange[RANGE.START_TIME] &&
              bubble[RANGE.END_TIME] >= currentRange[RANGE.END_TIME]
          )
          .sort((a, b) => a[RANGE.DEPTH] - b[RANGE.DEPTH]);
        let startDirection = -1;
        if (containedBy.length > 0) {
          startDirection =
            containedBy[0][RANGE.START_TIME] < currentRange[RANGE.START_TIME]
              ? -1
              : 1;
        }
        extendAround(ranges, startDirection, changes, currentRange);
        if (Object.keys(changes).length === 1) {
          extendAround(ranges, -1 * startDirection, changes, currentRange);
        }
      }
      return update(state, changes);
    case DELETE_REDUNDANT_SIZES:
      const removals = {
        $unset: [],
      };
      Object.values(state)
        .sort(
          (a, b) =>
            b[RANGE.END_TIME] -
            b[RANGE.START_TIME] -
            (a[RANGE.END_TIME] - a[RANGE.START_TIME])
        )
        .forEach((item, index, array) => {
          if (index > 0) {
            const previousItem = array[index - 1];
            if (
              previousItem[RANGE.START_TIME] === item[RANGE.START_TIME] &&
              previousItem[RANGE.END_TIME] === item[RANGE.END_TIME]
            ) {
              removals.$unset.push(
                previousItem[RANGE.DEPTH] > item[RANGE.DEPTH]
                  ? previousItem.id
                  : item.id
              );
            }
          }
        });
      return removals.$unset.length > 0 ? update(state, removals) : state;
    case UPDATE_DEPTHS_AFTER_DELETE:
      const rangesSorted = Object.values(state).sort(
        (a, b) =>
          a[RANGE.END_TIME] -
          a[RANGE.START_TIME] -
          (b[RANGE.END_TIME] - b[RANGE.START_TIME])
      );
      const maxDepths = [];
      return update(
        state,
        rangesSorted.reduce((depthChanges, bubble, index) => {
          if (bubble[RANGE.DEPTH] > 1) {
            maxDepths[index] = Math.max.apply(
              null,
              rangesSorted
                .slice(0, index)
                .map((possibleContainment, idx) =>
                  bubble[RANGE.START_TIME] <=
                    possibleContainment[RANGE.START_TIME] &&
                  bubble[RANGE.END_TIME] >= possibleContainment[RANGE.END_TIME]
                    ? maxDepths[idx] + 1 || 1
                    : 1
                )
            );
          } else {
            maxDepths[index] = bubble[RANGE.DEPTH];
          }
          if (bubble[RANGE.DEPTH] !== maxDepths[index]) {
            depthChanges[bubble.id] = {
              [RANGE.DEPTH]: {
                $set: maxDepths[index],
              },
            };
            if (DEFAULT_COLOURS.indexOf(bubble[RANGE.COLOUR] !== -1)) {
              depthChanges[bubble.id][RANGE.COLOUR] = {
                $set:
                  DEFAULT_COLOURS[maxDepths[index] % DEFAULT_COLOURS.length],
              };
            }
          }
          return depthChanges;
        }, {})
      );
    case LOAD_RANGES:
      return typeof action.ranges === 'number'
        ? {
            'id-0': {
              ...DEFAULT_RANGES_STATE['id-0'],
              [RANGE.END_TIME]: action.ranges,
            },
          }
        : action.ranges;
    default:
      return state;
  }
};

export default range;
