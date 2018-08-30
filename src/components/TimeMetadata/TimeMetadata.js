import React, { Component } from 'react';
import PropTypes from 'prop-types';

class TimeMetadata extends Component {
  static propTypes = {
    /** Current label of the manifest or range */
    manifestLabel: PropTypes.string.isRequired,
    /** Current summary of the manifest or range */
    manifestSummary: PropTypes.string.isRequired,
    /** Total runtime of manifest */
    runtime: PropTypes.number.isRequired,
    /** Current time */
    currentTime: PropTypes.number.isRequired,
    /** Array of Ranges */
    ranges: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        summary: PropTypes.string.isRequired,
        startTime: PropTypes.number.isRequired,
        endTime: PropTypes.number.isRequired,
      }).isRequired
    ).isRequired,
  };

  render() {
    return <div />;
  }
}

export default TimeMetadata;
