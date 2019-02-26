import { PROJECT, RDF_NAMESPACE } from '../constants/project';
import { CANVAS } from '../constants/canvas';
import { RANGE, DEFAULT_COLOURS, DEFAULT_RANGE } from '../constants/range';
import { VIEWSTATE } from '../constants/viewState';
import { resolveAvResource } from '../containers/AuthResource/AuthResource';
import generateId from './generateId';

// Constants

const BACKGROUND_COLOUR_PROPERTY = 'tl:backgroundColour';
const TEXT_COLOUR_PROPERTY = 'tl:textColour';

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
  const [startString, endString] = rangeStr.split(',');
  return {
    [RANGE.START_TIME]: sToMs(startString),
    [RANGE.END_TIME]: endString ? sToMs(endString) : sToMs(startString) + 1,
  };
};

const getLabel = (t, defaultValue) => {
  const value = Object.values(t)[0];
  if (value && value.length) {
    return value[0] || defaultValue;
  }
  return defaultValue;
};

export const parseMarkers = manifest => {
  const annotationPages = manifest.annotations;
  const annotations =
    annotationPages && annotationPages[0] && annotationPages[0].items
      ? annotationPages[0].items
      : null;

  if (!annotations) {
    return [];
  }

  return annotations
    .map(annotation => ({
      id: annotation.id,
      time:
        annotation.target &&
        annotation.target.selector &&
        annotation.target.selector.t
          ? annotation.target.selector.t
          : null,
      label: getLabel(annotation.label, 'Untitled marker'),
      summary:
        annotation.body && annotation.body.value
          ? annotation.body.value
          : annotation.body[0] && annotation.body[0].value
          ? annotation.body[0].value
          : '',
    }))
    .filter(annotation => annotation.time);
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
    ? canvas.items.reduce((acc, annotationPage) => {
        if (annotationPage.items) {
          return acc.concat(annotationPage.items);
        } else {
          return acc;
        }
      }, [])
    : [];

  return annotations
    .filter(
      annotation =>
        (annotation.motivation === 'painting' &&
          annotation.body &&
          annotation.body.type === 'Audio') ||
        (annotation.body && annotation.body.type === 'Choice')
    )
    .map(annotation => {
      const hashParams = hashParamsToObj(annotation.target);
      const audioDescriptor = {};
      if (hashParams.t) {
        Object.assign(audioDescriptor, parseTimeRange(hashParams.t));
      }
      const body = resolveAvResource(annotation);
      audioDescriptor.url = body.id || body['@id'];
      if (body && body.service) {
        audioDescriptor.service = body.service;
      }

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
        service: audioAnnotations[0].service,
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
      [RANGE.WHITE_TEXT]:
        [
          '#fff',
          '#fffff',
          'white',
          'rgb(255, 255, 255)',
          'rgba(255, 255, 255, 1)',
        ].indexOf(structure[TEXT_COLOUR_PROPERTY]) !== -1,
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
  const allStructures = (manifest.structures || []).map(structure =>
    processLevel(structure)
  );

  if (manifest.items.length > 1) {
    console.warn(
      'Timeliner does not have full support for multi-canvas elements'
    );
  }

  const finalRanges = Array.prototype.concat.apply([], allStructures);

  const startMin = Math.min(...finalRanges.map(range => range.startTime));
  const endMax = Math.max(...finalRanges.map(range => range.endTime));
  const canvas = manifest.items[0];

  if (
    canvas.duration &&
    (startMin !== 0 || endMax !== canvas.duration * 1000)
  ) {
    console.log('Unstable state, ranges must go from start to finish', { startMin, endMax, canvasDuration: canvas.duration });
    return [
      {
        ...DEFAULT_RANGE,
        id: generateId(),
        startTime: 0,
        endTime: canvas.duration * 1000,
      },
    ];
  }

  return finalRanges.reduce((ranges, range) => {
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
