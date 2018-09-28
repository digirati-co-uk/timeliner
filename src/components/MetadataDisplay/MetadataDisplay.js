import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import formatDate from 'date-fns/format';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Grid,
} from '@material-ui/core';
import { Edit } from '@material-ui/icons';

// const displayTime = time =>
//   formatDate(time, time >= 3600000 ? 'hh:mm:ss' : 'mm:ss');

const MetadataDisplay = props => (
  <Card
    style={{
      borderLeft: `4px solid ${props.colour}`,
      marginLeft: `${(props.depth - 1) * 24}px`,
      marginBottom: 16,
    }}
  >
    <CardContent>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid item>
          <Typography variant="title" component="h3">
            {props.label}
          </Typography>
        </Grid>
        <Grid>
          <IconButton>
            <Edit onClick={props.onEditClick} />
          </IconButton>
        </Grid>
      </Grid>
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
  /** Time (ms) when metadata should be displayed from */
  startTime: PropTypes.number.isRequired,
  /** Time (ms) when metadata should be displayed until */
  endTime: PropTypes.number.isRequired,
  /** On Edit Click handler */
  onEditClick: PropTypes.func,
};

export default MetadataDisplay;
