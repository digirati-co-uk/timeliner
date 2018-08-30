import React, { Component } from 'react';
import PropTypes from 'prop-types';

class CurrentTimeIndicator extends Component {
  static propTypes = {
    currentTime: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
  };
  render() {
    return <div>CurrentTimeIndicator</div>;
  }
}
