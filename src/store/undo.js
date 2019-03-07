import { createUndoMiddleware } from 'redux-undo-redo';
import { SET_DESCRIPTION, SET_LANGUAGE, SET_TITLE } from '../constants/project';
import { UPDATE_RANGE, RANGE_MUTATION } from '../constants/range';
import { setDescription, setLanguage, setTitle } from '../actions/project';
import { undo } from '../reducers/range';
import {
  CREATE_MARKER,
  DELETE_MARKER,
  DELETE_MARKERS,
  UPDATE_MARKER,
} from '../constants/markers';
import { deleteMarker, importMarkers, updateMarker } from '../actions/markers';

export default createUndoMiddleware({
  revertingActions: {
    [SET_TITLE]: {
      action: (action, title) => setTitle(title),
      createArgs: state => state.project.title,
    },
    [SET_DESCRIPTION]: {
      action: (action, description) => setDescription(description),
      createArgs: state => state.project.description,
    },
    [SET_LANGUAGE]: {
      action: (action, language) => setLanguage(language),
      createArgs: state => state.project.language,
    },
    [UPDATE_RANGE]: {
      action: (action, range) => ({ type: UPDATE_RANGE, payload: range }),
      createArgs: (state, action) => state.range[action.payload.id],
    },
    [RANGE_MUTATION]: {
      action: (action, undoAction) => undoAction,
      createArgs: (state, action) => undo(state.range, action),
    },

    [CREATE_MARKER]: {
      action: action => deleteMarker(action.payload.marker.id),
    },
    [UPDATE_MARKER]: {
      action: (action, marker) => updateMarker(action.payload.id, marker),
      createArgs: (state, action) => state.markers.list[action.payload.id],
    },
    [DELETE_MARKER]: {
      action: (action, marker) => importMarkers([marker]),
      createArgs: (state, action) => state.markers.list[action.payload.id],
    },
    [DELETE_MARKERS]: {
      action: (action, markers) => importMarkers(markers),
      createArgs: (state, action) =>
        action.payload.ids.map(markerId => state.markers.list[markerId]),
    },
  },
});
