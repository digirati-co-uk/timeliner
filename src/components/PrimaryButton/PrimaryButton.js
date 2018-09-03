import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './PrimaryButton.scss';

class PrimaryButton extends Component {
  static propTypes = {
    /** Content of the button */
    children: PropTypes.node.isRequired,
    /** Additional styles */
    style: PropTypes.shape(),
    /** Modifiers, should be a map, where the key is the modifier
     * and the value is true/false for an active state */
    modifiers: PropTypes.shape(),
  };

  static defaultProps = {
    style: {},
    modifiers: {},
  };

  render() {
    return <div />;
  }
}

export default PrimaryButton;
