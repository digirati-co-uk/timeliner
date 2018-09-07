import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import MetadataDisplay from '../MetadataDisplay/MetadataDisplay';

const TimeMetadata = props => (
  <div>
    <Typography variant="display1" component="h3">
      {props.manifestLabel}
    </Typography>
    <Typography variant="body1" component="pre">
      {props.manifestSummary}
    </Typography>
    {props.ranges
      .filter(
        range =>
          range.startTime <= props.currentTime &&
          range.endTime >= props.currentTime
      )
      .map(range => (
        <MetadataDisplay {...range} />
      ))}
  </div>
);

TimeMetadata.propTypes = {
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

export default TimeMetadata;
