import { RANGE } from '../constants/range';
import {
  PROJECT,
  RDF_NAMESPACE,
  PROJECT_SETTINGS_KEYS,
  SETTINGS_ATTRIBUTE,
} from '../constants/project';

const toSeconds = msValue => msValue / 1000;

const exportLevel = (bubble, parentChildren, canvasId, languageCode) => {
  if (bubble.done) {
    return;
  }
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
  if (bubble.hasOwnProperty(RANGE.COLOUR)) {
    range[`${RDF_NAMESPACE}:backgroundColour`] = bubble[RANGE.COLOUR];
  }

  if (bubble.hasOwnProperty('children')) {
    range.items = [];
    range.done = true;
    bubble.children.forEach(child => exportLevel(child, range.items, canvasId));
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

const exportRanges = (range, canvasId, languageCode) => {
  const bubbles = JSON.parse(JSON.stringify(Object.values(range)))
    // making sure the big
    .sort(
      (a, b) =>
        b[RANGE.END_TIME] -
        b[RANGE.START_TIME] -
        (a[RANGE.END_TIME] - a[RANGE.START_TIME])
    );
  bubbles.forEach((bubble, idx) => {
    const possibleParents = bubbles.slice(0, idx - 1).reverse();
    possibleParents.forEach(parentBubble => {
      if (
        parentBubble.id !== bubble.id &&
        parentBubble[RANGE.END_TIME] >= bubble[RANGE.END_TIME] &&
        parentBubble[RANGE.START_TIME] <= bubble[RANGE.START_TIME]
      ) {
        bubble.parent = parentBubble;
        if (parentBubble.hasOwnProperty('children')) {
          parentBubble.children.append(bubble);
        } else {
          parentBubble.children = [bubble];
        }
      }
    });
  });
  const ranges = [];
  bubbles.forEach(bubble => {
    if (!bubble.done) {
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

const exporter = state => {
  return {
    ...state.project.loadedJson,
    structures: exportRanges(
      state.range,
      state.project[PROJECT.LOADED_JSON].items[0].id,
      state.project[PROJECT.LANGUAGE]
    ),
    [SETTINGS_ATTRIBUTE]: getProjectSettings(state.project),
  };
};

export default exporter;
