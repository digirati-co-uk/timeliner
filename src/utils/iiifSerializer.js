const KEY_ORDER = [
  '@context',
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
];

const [KEY_ORDER_MAP, REVERSE_MAP] = KEY_ORDER.reduce(
  (kom, key, idx) => {
    const paddedIdx = `${idx}`.padStart(4, '0');
    kom[0][key] = paddedIdx;
    kom[1][paddedIdx] = key;
    return kom;
  },
  [{}, {}]
);

const isArray = i => i instanceof Array;
const isDictionary = i => i instanceof Object && !(i instanceof Array);
const getIndent = indent => new Array(indent + 1).join(' ');

export const serialize = (item, indent = 0, indentIncrement = 2) => {
  let result = [];
  if (isArray(item)) {
    result.push('[');
    result.push(
      item
        .map(
          child =>
            (!isDictionary(child) && !isArray(child)
              ? '\n' + getIndent(indent + indentIncrement)
              : '') + serialize(child, indent + indentIncrement)
        )
        .join(',\n')
    );
    result.push('\n', getIndent(indent), ']');
  } else if (isDictionary(item)) {
    const keyValues = Object.keys(item)
      .map(key => {
        if (KEY_ORDER_MAP.hasOwnProperty(key)) {
          return [KEY_ORDER_MAP[key], item[key]];
        } else {
          return [key, item[key]];
        }
      })
      .sort((a, b) => {
        if (a[0] > b[0]) {
          return 1;
        }
        if (a[0] < b[0]) {
          return -1;
        }
        return 0;
      });
    result.push('{');
    result.push(
      keyValues
        .map(
          ([key, value]) =>
            '\n' +
            getIndent(indent + indentIncrement) +
            '"' +
            (REVERSE_MAP.hasOwnProperty(key) ? REVERSE_MAP[key] : key) +
            '": ' +
            serialize(value, indent + indentIncrement)
        )
        .join(',')
    );
    result.push('\n', getIndent(indent), '}');
  } else if (typeof item === 'string') {
    result.push('"', item, '"');
  } else if (typeof item === 'number' || typeof item === 'boolean') {
    result.push(item);
  }
  return result.join('');
};
