import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './MergeButton.scss';

class MergeButton extends Component {
  static propTypes = {
    /** Contents of the button */
    children: PropTypes.node.isRequired,
    /** Handler for when the button is clicked */
    onClick: PropTypes.func.isRequired,
  };

  render() {
    return <div />;
  }
}

export default MergeButton;
