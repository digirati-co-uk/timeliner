import React from 'react';
import { PropTypes } from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloudDownload from '@material-ui/icons/CloudDownload';
import RestorePage from '@material-ui/icons/RestorePage';
import Edit from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';

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
      component="p"
      style={{
        whiteSpace: 'pre-line',
      }}
    >
      {props.manifestSummary || 'Description of manifest'}
    </Typography>
    <h5>Source</h5>
    <Typography variant="body1" component="p">
      <a href={props.url}>{props.url}</a>
    </Typography>
    <hr />
    <Grid
      container
      direction="row"
      justify="flex-start"
      alignItems="flex-start"
    >
      <Grid item xs={12} style={{ margin: 5 }}>
        <Button
          variant="text"
          color="primary"
          onClick={props.onSaveButtonClicked}
          title="Download project"
        >
          <CloudDownload nativeColor="#FF4081" style={{ marginRight: 20 }} />
          Download this project
        </Button>
      </Grid>
      <Grid item xs={12} style={{ margin: 5 }}>
        <Button
          variant="text"
          color="primary"
          onClick={props.onEraseButtonClicked}
          title="Start project over"
        >
          <RestorePage nativeColor="#303F9F" style={{ marginRight: 20 }} />
          Start this project over
        </Button>
      </Grid>
    </Grid>
  </div>
);

ProjectMetadataDisplay.propTypes = {
  manifestLabel: PropTypes.string,
  manifestSummary: PropTypes.string,
  url: PropTypes.string,
  onEditClick: PropTypes.func,
  onSaveButtonClicked: PropTypes.func,
  onEraseButtonClicked: PropTypes.func,
};

export default ProjectMetadataDisplay;
