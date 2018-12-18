import React from 'react';
import PropTypes from 'prop-types';
import KeyboardEventHandler from 'react-keyboard-event-handler';

const emptyFn = () => {};
const MODIFIER_KEYS = ['Meta', 'Shift', 'Control', 'Alt'];

const getKeyCombinationPressed = (key, ev) => {
  let keyCombo = [];
  if (key === 'other') {
    if (ev.metaKey) {
      keyCombo.push('meta');
    }
    if (ev.ctrlKey) {
      keyCombo.push('ctrl');
    }
    if (ev.altKey) {
      keyCombo.push('alt');
    }
    if (ev.shiftKey) {
      keyCombo.push('shift');
    }
    if (MODIFIER_KEYS.indexOf(ev.key) === -1) {
      keyCombo.push(String.fromCharCode(ev.keyCode));
    }
  } else {
    keyCombo = [key];
  }
  return keyCombo.join('+').toLowerCase();
};

const KeyboardControlsProvider = props => (
  <KeyboardEventHandler
    handleKeys={Object.keys(props.commands).map(key =>
      key === 'default' ? 'all' : key
    )}
    onKeyEvent={(key, ev) => {
      const keyCombo = getKeyCombinationPressed(key, ev);
      (props.commands[keyCombo] || props.commands.default || emptyFn)(
        keyCombo,
        key,
        ev
      );
    }}
  />
);

KeyboardControlsProvider.propTypes = {
  commands: PropTypes.object.isRequired,
};

KeyboardControlsProvider.defaultProps = {
  commands: {},
};

export default KeyboardControlsProvider;
