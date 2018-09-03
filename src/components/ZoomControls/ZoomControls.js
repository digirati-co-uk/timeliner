import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ZoomControls.scss';

class ZoomControls extends Component {
  static PropTypes = {
    /** Handler for zooming in, will show disabled if null */
    onZoomIn: PropTypes.func,
    /** Handler for zooming out, will show disabled if null */
    onZoomOut: PropTypes.func,
    /** Handler for resetting view */
    onResetView: PropTypes.func,
  };

  static defaultProps = {
    onZoomIn: null,
    onZoomOut: null,
    onResetView: null,
  };

  render() {
    return <div />;
  }
}

export default ZoomControls;
