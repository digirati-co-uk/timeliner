import { RANGE } from '../constants/range';
import {
  PROJECT,
  RDF_NAMESPACE,
  PROJECT_SETTINGS_KEYS,
  SETTINGS_ATTRIBUTE,
} from '../constants/project';

const toSeconds = msValue => msValue / 1000;

const exportLevel = (bubble, parentChildren, canvasId, languageCode) => {
  const range = {
    id: bubble.id,
    type: 'Range',
    label: {
      [languageCode]: [bubble.label],
    },
  };
  if (bubble.summary !== '') {
    range.summary = {
      [languageCode]: [bubble.summary],
    };
  }
  if (bubble.hasOwnProperty(RANGE.COLOUR) && bubble[RANGE.COLOUR]) {
    range[`${RDF_NAMESPACE}:backgroundColour`] = bubble[RANGE.COLOUR];
  }

  if (bubble.hasOwnProperty(RANGE.WHITE_TEXT) && bubble[RANGE.WHITE_TEXT]) {
    range[`${RDF_NAMESPACE}:textColour`] = '#fff';
  }

  if (bubble.hasOwnProperty('children')) {
    range.items = [];
    bubble.children.forEach(child =>
      exportLevel(child, range.items, canvasId, languageCode)
    );
  } else {
    const canvasStartTime = toSeconds(bubble[RANGE.START_TIME]);
    const canvasEndTime = toSeconds(bubble[RANGE.END_TIME]);
    range.items = [
      {
        type: 'Canvas',
        id: `${canvasId}#t=${canvasStartTime},${canvasEndTime}`,
      },
    ];
  }
  parentChildren.push(range);
};

const exportMarkers = (markers, id, lang) =>
  Object.keys(markers.list).length
    ? [
        {
          type: 'AnnotationPage',
          items: Object.values(markers.list)
            .sort((a, b) => {
              return a.time - b.time;
            })
            .map(marker => ({
              id: marker.id,
              type: 'Annotation',
              label: { [lang]: [marker.label] },
              body: {
                type: 'TextualBody',
                value: marker.summary || '',
                format: 'text/plain',
                language: lang,
              },
              target: {
                type: 'SpecificResource',
                source: id,
                selector: {
                  type: 'PointSelector',
                  t: toSeconds(marker.time),
                },
              },
            })),
        },
      ]
    : [];

const exportRanges = (range, canvasId, languageCode) => {
  const bubbles = JSON.parse(JSON.stringify(Object.values(range.list)))
    // making sure the big
    .sort(
      (a, b) =>
        b[RANGE.END_TIME] -
        b[RANGE.START_TIME] -
        (a[RANGE.END_TIME] - a[RANGE.START_TIME])
    );

  bubbles.forEach((bubble, idx) => {
    const possibleParents = bubbles.slice(0, idx).reverse();
    possibleParents.some(parentBubble => {
      if (
        parentBubble.id !== bubble.id &&
        parentBubble[RANGE.END_TIME] >= bubble[RANGE.END_TIME] &&
        parentBubble[RANGE.START_TIME] <= bubble[RANGE.START_TIME]
      ) {
        bubble.parent = parentBubble;
        if (parentBubble.hasOwnProperty('children')) {
          parentBubble.children.push(bubble);
        } else {
          parentBubble.children = [bubble];
        }
        return true;
      }
    });
  });
  const ranges = [];
  bubbles.forEach(bubble => {
    if (!bubble.parent) {
      exportLevel(bubble, ranges, canvasId, languageCode);
    }
  });

  return ranges;
};

export const getProjectSettings = project =>
  PROJECT_SETTINGS_KEYS.reduce((settings, key) => {
    settings[`${RDF_NAMESPACE}:${key}`] = project[key];
    return settings;
  }, {});

const getProjectMetadata = project => ({
  label: {
    [project[PROJECT.LANGUAGE]]: [project[PROJECT.TITLE]],
  },
  summary: {
    [project[PROJECT.LANGUAGE]]: [project[PROJECT.DESCRIPTION]],
  },
});

const exporter = state => {
  return {
    ...state.project.loadedJson,
    structures: exportRanges(
      state.range,
      state.project[PROJECT.LOADED_JSON].items[0].id,
      state.project[PROJECT.LANGUAGE]
    ),
    annotations: exportMarkers(
      state.markers,
      state.project[PROJECT.LOADED_JSON].items[0].id,
      state.project[PROJECT.LANGUAGE]
    ),
    [SETTINGS_ATTRIBUTE]: getProjectSettings(state.project),
    ...getProjectMetadata(state.project),
  };
};

export default exporter;
