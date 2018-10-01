import { RANGE } from '../constants/range';

const PROJECT_SETTINGS_ATTRIBUTE = 'digirati:settings';

const exportLevel = (bubble, parentChildren, canvasId) => {
  console.log(bubble, parentChildren, canvasId);
  if (bubble.done) {
    return;
  }
  const range = {
    id: bubble.id,
    type: 'Range',
  };
  if (bubble.hasOwnProperty('children')) {
    range.items = [];
    range['digirati:backgroundColour'] = bubble[RANGE.COLOUR];
    range.done = true;
    bubble.children.forEach(child => exportLevel(child, range.items, canvasId));
  } else {
    const canvasStartTime = bubble[RANGE.START_TIME] / 1000;
    const canvasEndTime = bubble[RANGE.END_TIME] / 1000;
    range.items = [
      {
        type: 'Canvas',
        id: `${canvasId}#t=${canvasStartTime},${canvasEndTime}`,
      },
    ];
  }
  parentChildren.push(range);
};

const exportRanges = (range, canvasId) => {
  const bubbles = JSON.parse(JSON.stringify(Object.values(range)))
    // making sure the big
    .sort(
      (a, b) =>
        b[RANGE.END_TIME] -
        b[RANGE.START_TIME] -
        (a[RANGE.END_TIME] - a[RANGE.START_TIME])
    );
  console.log(bubbles);
  bubbles.forEach((bubble, idx) => {
    const possibleParents = bubbles.slice(0, idx - 1).reverse();
    console.log(bubble, possibleParents);
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
      exportLevel(bubble, ranges, canvasId);
    }
  });

  return ranges;
};

const exporter = state => {
  return {
    ...state.project.loadedJson,
    structures: exportRanges(state.range, state.project.loadedJson.items[0].id),
    [PROJECT_SETTINGS_ATTRIBUTE]: state.project.settings,
  };
};

export default exporter;
