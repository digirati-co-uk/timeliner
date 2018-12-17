import { PROJECT, RDF_NAMESPACE } from '../constants/project';
import { CANVAS } from '../constants/canvas';
import { RANGE, DEFAULT_COLOURS } from '../constants/range';
import { VIEWSTATE } from '../constants/viewState';

// Constants

const BACKGROUND_COLOUR_PROPERTY = 'tl:backgroundColour';

// Helpers

/**
 * seconds to microseconds
 * @param {String|Number} s seconds to convert
 * @return {Number} milliseconds
 */
const sToMs = s => parseFloat(s) * 1000;

/**
 * returns localised property
 * @param {Object} resource
 * @param {String} locale default en
 */
const getLocalisedResource = (resource, locale = 'en') => {
  if (!resource) {
    return '';
  } else {
    return (resource[locale] || ['']).join('');
  }
};

/**
 * get custom bubble colour
 * @param {Object} range the range may has the background property
 */
const getColour = range =>
  range
    ? range[RANGE.COLOUR] ||
      DEFAULT_COLOURS[(range[RANGE.DEPTH] - 1) % DEFAULT_COLOURS.length] ||
      ''
    : '';

/**
 * converts url hash parameters to an object
 * @param {String} url input url
 * @returns {Object} the key-value pairs converted to object property-values.
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
 * @returns array all audio annotations url, start and end time
 */
const getAudioAnnotations = canvas => {
  if (!canvas) {
    return [];
  }
  const annotations = canvas.items
    ? canvas.items.reduce((annos, annotationPage) => {
        if (annotationPage.items) {
          return annos.concat(annotationPage.items);
        } else {
          return annos;
        }
      }, [])
    : [];
  return annotations
    .filter(
      annotation =>
        annotation.motivation === 'painting' &&
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
const processCanvas = canvas => {
  const audioAnnotations = getAudioAnnotations(canvas);
  return audioAnnotations.length > 0
    ? {
        [CANVAS.URL]: audioAnnotations[0].url,
      }
    : {
        [CANVAS.ERROR]: {
          code: 6,
          description: 'Manifest does not contain audio annotations',
        },
      };
};

const extendRange = (parentRange, child) => {
  parentRange[RANGE.START_TIME] = Math.min(
    parentRange[RANGE.START_TIME],
    child[RANGE.START_TIME]
  );
  parentRange[RANGE.END_TIME] = Math.max(
    parentRange[RANGE.END_TIME],
    child[RANGE.END_TIME]
  );
  parentRange[RANGE.DEPTH] = Math.max(
    child[RANGE.DEPTH] + 1,
    parentRange[RANGE.DEPTH] || 1
  );
};

const processLevel = structure => {
  if (structure.type === 'Canvas') {
    const hashParams = hashParamsToObj(structure.id);
    return {
      ...parseTimeRange(hashParams.t),
      [RANGE.DEPTH]: 0,
    };
  } else if (structure.type === 'Range') {
    const range = {
      id: structure.id,
      [RANGE.LABEL]: getLocalisedResource(structure.label) || '',
      [RANGE.SUMMARY]: getLocalisedResource(structure.summary) || '',
      [RANGE.START_TIME]: Number.MAX_SAFE_INTEGER,
      [RANGE.END_TIME]: Number.MIN_SAFE_INTEGER,
      [RANGE.DEPTH]: 1,
      [RANGE.COLOUR]: structure[BACKGROUND_COLOUR_PROPERTY],
      [RANGE.IS_SELECTED]: false,
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

const processStructures = manifest => {
  var allStructures = (manifest.structures || []).map(structure =>
    processLevel(structure)
  );

  return Array.prototype.concat
    .apply([], allStructures)
    .reduce((ranges, range) => {
      if (range) {
        range[RANGE.COLOUR] = getColour(range);
        ranges[range.id] = range;
      }
      return ranges;
    }, {});
};

const mapSettings = iiifSettings =>
  Object.entries(iiifSettings || {}).reduce((settings, [rdfKey, value]) => {
    const key = rdfKey.split(':')[1];
    settings[key] = value;
    return settings;
  }, {});

const manifestToProject = manifest => ({
  [PROJECT.DESCRIPTION]: getLocalisedResource(manifest.summary) || '',
  [PROJECT.TITLE]: getLocalisedResource(manifest.label) || '',
  [PROJECT.LOADED_JSON]: manifest,
  ...mapSettings(manifest[`${RDF_NAMESPACE}:settings`]),
});

function getDuration(manifest) {
  return manifest &&
    manifest.items &&
    manifest.items[0] &&
    manifest.items[0].items &&
    manifest.items[0].items[0] &&
    manifest.items[0].items[0].items &&
    manifest.items[0].items[0].items[0] &&
    manifest.items[0].items[0].items[0].body &&
    manifest.items[0].items[0].items[0].body.duration
    ? sToMs(manifest.items[0].items[0].items[0].body.duration)
    : 0;
}

const manifestToViewState = manifest => ({
  [VIEWSTATE.RUNTIME]: getDuration(manifest),
  [VIEWSTATE.IS_IMPORT_OPEN]: false,
  [VIEWSTATE.IS_SETTINGS_OPEN]: false,
});

export const loadProjectState = (manifest, source) => ({
  project: manifestToProject(manifest),
  canvas: processCanvas(manifest.items ? manifest.items[0] : null),
  range: processStructures(manifest),
  viewState: manifestToViewState(manifest),
  source,
});
