import {
  UPDATE_MARKER_POSITION,
  UPDATE_MARKER,
  IMPORT_MARKERS,
  DELETE_MARKER,
  SHOW_MARKERS,
  HIDE_MARKERS,
  SELECT_MARKER,
  DESELECT_MARKER,
  CLEAR_MARKERS,
  DELETE_MARKERS,
  CREATE_MARKER,
} from '../constants/markers';

const generateNewId = () => `marker-${new Date().getTime()}`;

export const addMarkerAtTime = time => {
  const marker = {
    id: generateNewId(),
    label: '',
    time,
  };
  return createMarker(marker);
};

export const addMarkerPopulated = (label, summary, time) => {
  const marker = {
    id: generateNewId(),
    label,
    summary,
    time,
  };
  return createMarker(marker);
};

export const updateMarker = (markerId, { label, summary, time }) => ({
  type: UPDATE_MARKER,
  payload: { id: markerId, label, summary, time },
});

/**
 * @deprecated
 */
export const updateMarkerPosition = (markerId, { x }) => ({
  type: UPDATE_MARKER_POSITION,
  payload: { markerId, x },
});

export const importMarkers = markers => ({
  type: IMPORT_MARKERS,
  payload: { markers },
});

export const createMarker = marker => ({
  type: CREATE_MARKER,
  payload: { marker },
});

export const clearMarkers = () => ({
  type: CLEAR_MARKERS,
});

export const deleteMarker = markerId => ({
  type: DELETE_MARKER,
  payload: { id: markerId },
});

export const deleteMarkers = markerIds => ({
  type: DELETE_MARKERS,
  payload: { ids: markerIds },
});

export const showMarkers = () => ({
  type: SHOW_MARKERS,
});

export const hideMarkers = () => ({
  type: HIDE_MARKERS,
});

export const selectMarker = markerId => ({
  type: SELECT_MARKER,
  payload: { id: markerId },
});

export const deselectMarker = markerId => ({
  type: DESELECT_MARKER,
  payload: { id: markerId },
});
