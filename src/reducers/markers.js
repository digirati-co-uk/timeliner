import update from 'immutability-helper';
import {
  UPDATE_MARKER,
  IMPORT_MARKERS,
  DELETE_MARKER,
  SHOW_MARKERS,
  HIDE_MARKERS,
  MARKER,
  SELECT_MARKER,
  DESELECT_MARKER,
  CLEAR_MARKERS,
  DELETE_MARKERS,
  CREATE_MARKER,
} from '../constants/markers';

export const DEFAULT_STATE = {
  list: {},
  selected: [],
  visible: true,
};

function filterUndefinedSets(acc, [key, change]) {
  if (typeof change.$set !== 'undefined') {
    acc[key] = change;
  }
  return acc;
}

export default function reducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_MARKER:
      if (!action.payload.id) {
        return state;
      }
      return update(state, {
        list: {
          [action.payload.id]: [
            [MARKER.ID, { $set: action.payload.id }],
            [MARKER.LABEL, { $set: action.payload.label }],
            [MARKER.SUMMARY, { $set: action.payload.summary }],
            [MARKER.TIME, { $set: action.payload.time }],
          ].reduce(filterUndefinedSets, {}),
        },
      });
    case CLEAR_MARKERS:
      return update(state, {
        list: { $set: {} },
        selected: { $set: [] },
      });
    case CREATE_MARKER:
      return update(state, {
        list: {
          [action.payload.marker.id]: { $set: action.payload.marker },
        },
      });
    case IMPORT_MARKERS:
      return update(state, {
        list: action.payload.markers.reduce((acc, next) => {
          if (next.id) {
            acc[next.id] = { $set: next };
          }
          return acc;
        }, {}),
      });
    case DELETE_MARKERS:
      return update(state, {
        list: { $unset: action.payload.ids },
      });
    case DELETE_MARKER:
      return update(state, {
        list: { $unset: [action.payload.id] },
      });
    case SHOW_MARKERS:
      return update(state, {
        visible: { $set: true },
      });
    case HIDE_MARKERS:
      return update(state, {
        visible: { $set: false },
      });
    case SELECT_MARKER:
      return update(state, {
        selected: { $push: [action.payload.id] },
      });
    case DESELECT_MARKER:
      const index = state.selected.indexOf(action.payload.id);
      if (index === -1) {
        return state;
      }
      return update(state, {
        selected: { $splice: [[state.selected.indexOf(action.payload.id), 1]] },
      });
    default:
      return state;
  }
}
