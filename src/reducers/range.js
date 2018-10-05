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
} from '../constants/range';

const generateNewId = () => `id-${new Date().getTime()}`;
const groupBubbles = selectedBubbles => {
  const group = selectedBubbles.reduce(
    (_group, bubble) => {
      if (_group[RANGE.START_TIME] > bubble[RANGE.START_TIME]) {
        _group[RANGE.START_TIME] = bubble[RANGE.START_TIME];
      }
      if (_group[RANGE.END_TIME] < bubble[RANGE.END_TIME]) {
        _group[RANGE.END_TIME] = bubble[RANGE.END_TIME];
      }
      if (_group[RANGE.DEPTH] < bubble[RANGE.DEPTH]) {
        _group[RANGE.DEPTH] = bubble[RANGE.DEPTH];
      }
      return _group;
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
    }
  );
  group.depth += 1;
  group.colour = DEFAULT_COLOURS[group.depth % DEFAULT_COLOURS.length];
  return group;
};

const range = (state = DEFAULT_RANGES_STATE, action) => {
  switch (action.type) {
    case SPLIT_RANGE_AT:
      const newId = generateNewId();
      const splitTime = action.payload.time;
      const itemToSplit = Object.values(state)
        .filter(
          bubble =>
            splitTime <= bubble[RANGE.END_TIME] &&
            splitTime >= bubble[RANGE.START_TIME]
        )
        .sort((b1, b2) => b1[RANGE.DEPTH] - b2[RANGE.DEPTH])[0];
      const endTime = itemToSplit[RANGE.END_TIME];
      return update(state, {
        [newId]: {
          $set: {
            id: newId,
            [RANGE.START_TIME]: action.payload.time,
            [RANGE.END_TIME]: endTime,
            [RANGE.COLOUR]: itemToSplit[RANGE.COLOUR],
            [RANGE.DEPTH]: itemToSplit[RANGE.DEPTH], //NOTE: this will be always depth 1...
          },
        },
        [itemToSplit.id]: {
          [RANGE.END_TIME]: {
            $set: action.payload.time,
          },
        },
      });
    case GROUP_RANGES:
      const selectedBubbles = Object.values(state).filter(
        bubble => bubble[RANGE.IS_SELECTED]
      );
      if (selectedBubbles.length < 2) {
        return state;
      }
      const unselectBubbles = selectedBubbles.reduce((updates, bubble) => {
        updates[bubble.id] = {
          isSelected: {
            $set: false,
          },
        };
        return updates;
      }, {});
      const newGroup = groupBubbles(selectedBubbles);
      return update(state, {
        [newGroup.id]: {
          $set: newGroup,
        },
        ...unselectBubbles,
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
          return changes;
        }, {})
      );
    case DELETE_RAGE:
      return update(state, {
        $unset: [action.payload.id],
      });
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
