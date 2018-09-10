import React from 'react';
import PropTypes from 'prop-types';
import KeyboardEventHandler from 'react-keyboard-event-handler';

const emptyFn = () => {};

const KeyboardControlsProvider = props => (
  <KeyboardEventHandler
    handleKeys={Object.keys(props.commands)}
    onKeyEvent={(key, ev) =>
      (props.commands[key] || props.commands.all || emptyFn)(key, ev)
    }
  />
);

KeyboardControlsProvider.propTypes = {
  commands: PropTypes.object.isRequired,
};

KeyboardControlsProvider.defaultProps = {
  commands: {},
};

export default KeyboardControlsProvider;
