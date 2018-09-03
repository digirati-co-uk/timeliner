import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class CurrentTimeIndicator extends Component {
  static propTypes = {
    currentTime: PropTypes.number.isRequired,
  };
  render() {
    return <div>CurrentTimeIndicator</div>;
  }
}
