import { DEFAULT_CANVAS_STATE } from '../constants/canvas';
import { DEFAULT_PROJECT_STATE, PROJECT } from '../constants/project';
import { RANGE } from '../constants/range';

// Constants

const BACKROUND_COLOUR_PROPERTY = 'digirati:backgroundColor';

// Helpers

/**
 * seconds to microseconds
 * @param {Number} s seconds to convert
 * @return {Number} milliseconds
 */
const sToMs = s => parseFloat(s) * 1000;

/**
 * returns localised property
 * @param {Object} resource
 * @param {String} locale default en
 */
const getLocalisedResource = (resource, locale) =>
  resource[locale || 'en'] || '';

/**
 * get custom bubble colour
 * @param {Object} range the range may has the background property
 */
const getColour = range => range[BACKROUND_COLOUR_PROPERTY];

/**
 * converts url hash parameters to an object
 * @param {String} url input url
 * @returns {Object} the key-value pairs converted to object porperty-values.
 */
const hashParamsToObj = url =>
  (url.split('#')[1] || '').split('&').reduce((params, item) => {
    const [k, v] = item.split('=');
    if (v !== undefined) {
      params[decodeURIComponent(k)] = decodeURIComponent(v);
    }
    return params;
  }, {});

/**
 * convert a comma separated time range to ms
 * @param {String} rangeStr
 */
const parseTimeRange = rangeStr => {
  const [startStr, endStr] = rangeStr.split(',');
  return {
    [RANGE.START_TIME]: sToMs(startStr),
    [RANGE.END_TIME]: sToMs(endStr),
  };
};

/**
 * @param {Object} canvas - IIIFCanvas javascript object
 * @returns all audio annotations url, start and end time
 */
const getAudioAnnotations = canvas => {
  const annotations =
    canvas.items && canvas.items.items ? canvas.items.items : [];
  return annotations
    .filter(
      annotation =>
        annotation.type === 'painting' &&
        annotation.body &&
        annotation.body.type === 'Audio'
    )
    .map(annotation => {
      const hashParams = hashParamsToObj(annotation.target);
      const audioDescriptor = {};
      if (hashParams.t) {
        Object.assign(audioDescriptor, parseTimeRange(hashParams.t));
      }
      audioDescriptor.url = annotation.body.id;
      return audioDescriptor;
    });
};

/**
 * Simplified version of the canvas processor:
 * - does not deal with multiple audio annotation on a canvas;
 * - does not handle choices with for different audio file formats;
 * - does not load av service documents;
 * @param {Object} canvas -
 */
export const processCanvas = canvas => {
  const projectDuration = sToMs(canvas.duration || 1);
  const audioAnnotations = getAudioAnnotations(canvas);
  return Object.assign({}, DEFAULT_CANVAS_STATE, {
    runTime: projectDuration,
    url: audioAnnotations[0].url,
  });
};

const extendRange = (parentRange, child) => {
  parentRange[RANGE.START_TIME] = Math.min(
    parentRange[RANGE.START_TIME],
    child[RANGE.END_TIME]
  );
  parentRange[RANGE.END_TIME] = Math.max(
    parentRange[RANGE.END_TIME],
    child[RANGE.END_TIME]
  );
};

const processLevel = structure => {
  if (structure.type === 'Canvas') {
    const hashParams = hashParamsToObj(structure.id);
    return parseTimeRange(hashParams.t);
  } else if (structure.type === 'Range') {
    const range = {
      id: structure.id,
      [RANGE.LABEL]: getLocalisedResource(structure.label) || '',
      [RANGE.SUMMARY]: getLocalisedResource(structure.summary) || '',
      [RANGE.START_TIME]: Number.MAX_SAFE_INTEGER,
      [RANGE.END_TIME]: Number.MIN_SAFE_INTEGER,
      colour: getColour(structure),
    };
    const ranges = [];
    structure.items.forEach(struct => {
      const result = processLevel(struct);
      if (struct.type === 'Canvas') {
        extendRange(range, result);
      } else if (struct.type === 'Range') {
        result.forEach(childRange => {
          if (childRange) {
            extendRange(range, childRange);
          }
        });
        ranges.push.apply(ranges, result);
      }
    });
    return [range].concat(ranges);
  }
};

export const processStructures = manifest => {
  var allStructures = (manifest.structures || []).map(structure =>
    processLevel(structure)
  );
  return Array.prototype.concat
    .apply([], allStructures)
    .reduce((ranges, range) => {
      ranges[range.id] = range;
    }, {});
};

export const porcessManifest = manifest => ({
  ...DEFAULT_PROJECT_STATE,
  [PROJECT.DESCRIPTION]: getLocalisedResource(manifest.label) || '',
  [PROJECT.TITLE]: getLocalisedResource(manifest.summary) || '',
  [PROJECT.JSON]: manifest,
});

export const loadProjectState = manifest => ({
  project: porcessManifest(manifest),
  canvas: processCanvas(manifest.items[0]),
  range: processStructures(manifest),
});
