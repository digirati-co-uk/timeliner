import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './LoadingIndicator.scss';

class LoadingIndicator extends Component {
  static propTypes = {
    /** Optional progress between 0-1 */
    loadingPercent: PropTypes.number,
  };

  render() {
    return <div />;
  }
}

export default LoadingIndicator;
