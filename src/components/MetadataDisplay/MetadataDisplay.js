import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './MetadataDisplay.scss';

class MetadataDisplay extends Component {
  static propTypes = {
    /** Label of the manifest or range */
    label: PropTypes.string.isRequired,
    /** Summary of the manifest or range */
    summary: PropTypes.string.isRequired,
    /** Time when metadata should be displayed from */
    startTime: PropTypes.number.isRequired,
    /** Time when metadata should be displayed until */
    endTime: PropTypes.number.isRequired,
  };

  render() {
    return <div />;
  }
}

export default MetadataDisplay;
