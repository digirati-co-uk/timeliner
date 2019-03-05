import langs from 'langs';
import { PROJECT_SETTINGS_KEYS, RDF_NAMESPACE } from '../constants/project';

const IIIF_KEY_ORDER = [
  '@context',
  '@none',
  'id',
  '@id',
  'type',
  '@type',
  'motivation',
  'label',
  'profile',
  'format',
  'language',
  'value',
  'metadata',
  'summary',
  'requiredStatement',
  'thumbnail',
  'homepage',
  'logo',
  'rights',
  'logo',
  'height',
  'width',
  'start',
  'viewingDirection',
  'behavior',
  'navDate',
  'rendering',
  'seeAlso',
  'partOf',
  'includes',
  'items',
  'structures',
  'annotations',
  'source',
  'selector',
  't',
];

const W3C_ANNOTATION_KEYS = ['body', 'target', 'duration'];

const TIMELINE_PROPERTIES = [
  `${RDF_NAMESPACE}:backgroundColour`,
  `${RDF_NAMESPACE}:textColour`,
  `${RDF_NAMESPACE}:settings`,
  ...PROJECT_SETTINGS_KEYS.map(key => `${RDF_NAMESPACE}:${key}`),
];

const LANGUAGES = langs.codes('1');

const KEY_ORDER = IIIF_KEY_ORDER.concat(
  W3C_ANNOTATION_KEYS,
  TIMELINE_PROPERTIES,
  LANGUAGES
);

export const serialize = item => {
  return JSON.stringify(item, KEY_ORDER, 2);
};
