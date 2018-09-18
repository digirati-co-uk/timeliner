import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import MetadataDisplay from '../MetadataDisplay/MetadataDisplay';
import { Grid, Card, CardContent, CardHeader } from '@material-ui/core';

const TimeMetadata = props => (
  <Grid
    container
    direction="column"
    justify="flex-start"
    alignItems="stretch"
    spacing={16}
  >
    {props.ranges
      .filter(
        range =>
          range.startTime <= props.currentTime &&
          range.endTime >= props.currentTime
      )
      .map(range => (
        <Grid item>
          <MetadataDisplay {...range} />
        </Grid>
      ))}
  </Grid>
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
