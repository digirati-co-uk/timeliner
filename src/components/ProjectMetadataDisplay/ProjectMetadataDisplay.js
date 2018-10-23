import React from 'react';
import { PropTypes } from 'prop-types';
import { Grid, Typography, IconButton } from '@material-ui/core';
import { Edit } from '@material-ui/icons';

const ProjectMetadataDisplay = props => (
  <div>
    <Grid
      container
      direction="row"
      justify="flex-start"
      alignItems="flex-start"
    >
      <Grid item xs={10}>
        <Typography variant="title" component="h3">
          {props.manifestLabel || 'Unnamed manifest'}
        </Typography>
      </Grid>
      <Grid item xs={2}>
        <IconButton onClick={props.onEditClick}>
          <Edit />
        </IconButton>
      </Grid>
    </Grid>
    <Typography
      variant="body1"
      component="pre"
      style={{
        whiteSpace: 'pre-line',
      }}
    >
      {props.manifestSummary || 'Description of manifest'}
    </Typography>
    <hr />
    <Typography variant="body1" component="p">
      <b>Source: </b> {props.url}
    </Typography>
  </div>
);

ProjectMetadataDisplay.propTypes = {
  manifestLabel: PropTypes.string,
  manifestSummary: PropTypes.string,
  url: PropTypes.string,
  onEditClick: PropTypes.func,
};

export default ProjectMetadataDisplay;
