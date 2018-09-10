import React, { Component } from 'react';
import PropTypes from 'prop-types';
import bem from '@fesk/bem-js';
import formatDate from 'date-fns/format';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  CardActions,
  IconButton,
} from '@material-ui/core';
import { Edit } from '@material-ui/icons';

const displayTime = time =>
  formatDate(time, time >= 3600000 ? 'hh:mm:ss' : 'mm:ss');

const MetadataDisplay = props => (
  <Card>
    <CardHeader
      title={`${props.label} [from ${displayTime(
        props.startTime
      )} to ${displayTime(props.endTime)}]`}
      action={
        <IconButton>
          <Edit />
        </IconButton>
      }
    />
    <CardContent>
      <Typography variant="body1" component="pre">
        {props.summary}
      </Typography>
    </CardContent>
  </Card>
);

MetadataDisplay.propTypes = {
  /** Label of the manifest or range */
  label: PropTypes.string.isRequired,
  /** Summary of the manifest or range */
  summary: PropTypes.string.isRequired,
  /** Time when metadata should be displayed from */
  startTime: PropTypes.number.isRequired,
  /** Time when metadata should be displayed until */
  endTime: PropTypes.number.isRequired,
};

export default MetadataDisplay;
