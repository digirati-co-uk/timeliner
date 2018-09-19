import update from 'immutability-helper';
import {
  DEFAULT_RANGE_STATE,
  SPLIT_RANGE_AT,
  GROUP_RANGES,
  ON_SELECT_RANGE,
  UPDATE_RANGE,
  MOVE_POINT,
  DELETE_RAGE,
} from '../constants/range';

const generateNewId = () => `id-${new Date().getTime()}`;
const groupBubbles = selectedBubbles => {
  const group = selectedBubbles.reduce(
    (_group, bubble) => {
      if (_group.startTime > bubble.startTime) {
        _group.startTime = bubble.startTime;
      }
      if (_group.endTime < bubble.endTime) {
        _group.endTime = bubble.endTime;
      }
      if (_group.depth < bubble.depth) {
        _group.depth = bubble.depth;
      }
      return _group;
    },
    {
      id: generateNewId(),
      startTime: Number.MAX_SAFE_INTEGER,
      endTime: Number.MIN_SAFE_INTEGER,
      depth: -1,
      label: '',
      summary: '',
      colour: -1,
    }
  );
  group.depth += 1;
  return group;
};

const range = (state = DEFAULT_RANGE_STATE, action) => {
  switch (action) {
    case SPLIT_RANGE_AT:
      const newId = generateNewId();
      const splitTime = action.payload.time;
      const itemToSplit = Object.values(state)
        .filter(bubble => splitTime <= bubble.to && splitTime >= bubble.from)
        .sort((b1, b2) => b1.depth - b2.depth);
      const endTime = itemToSplit.endTime;
      return update(state, {
        [newId]: {
          $set: {
            id: newId,
            startTime: action.payload.time,
            endTime: endTime,
          },
        },
        [itemToSplit.id]: {
          endTime: {
            $set: action.payload.time,
          },
        },
      });
    case GROUP_RANGES:
      const selectedBubbles = Object.values(state).filter(
        bubble => bubble.isSelected
      );
      if (selectedBubbles.length < 2) {
        return state;
      }
      const newGroup = groupBubbles(selectedBubbles);
      return update(state, {
        [newGroup.id]: {
          $set: newGroup,
        },
      });
    case ON_SELECT_RANGE:
      return update(state, {
        [action.payload.id]: {
          isSelected: {
            $set: action.payload.isSelected,
          },
        },
      });
    case UPDATE_RANGE:
      return update(state, {
        [action.payload.id]: {
          startTime: {
            $set: action.payload.startTime,
          },
          endTime: {
            $set: action.payload.endTime,
          },
          label: {
            $set: action.payload.label,
          },
          summary: {
            $set: action.payload.summary,
          },
          colour: {
            $set: action.payload.colour,
          },
        },
      });
    case MOVE_POINT:
      return update(
        state,
        Object.values(state).reduce((changes, bubble) => {
          if (bubble.startTime === action.payload.originalX) {
            changes[bubble.id].startTime = {
              $set: action.payload.x,
            };
          }
          if (bubble.endTime === action.payload.originalX) {
            changes[bubble.id].endTime = {
              $set: action.payload.x,
            };
          }
          return changes;
        })
      );
    case DELETE_RAGE:
    default:
      return state;
  }
};

export default range;
