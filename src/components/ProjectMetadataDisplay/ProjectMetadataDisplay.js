import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CloudDownload from '@material-ui/icons/CloudDownload';
import RestorePage from '@material-ui/icons/RestorePage';
import Button from '@material-ui/core/Button';

const ProjectMetadataDisplay = props => (
  <div>
    <div onClick={props.onEditClick} style={{ cursor: 'pointer' }}>
      <Typography variant="h6" component="h3" style={{ margin: '10px 0' }}>
        {props.manifestLabel || 'Unnamed manifest'}
      </Typography>
      <Typography
        variant="body1"
        component="p"
        style={{
          whiteSpace: 'pre-line',
        }}
      >
        {props.manifestSummary || 'Description of timeline'}
      </Typography>
    </div>
    {!props.noSourceLink && props.homepage && props.homepageLabel && (
      <Typography
        variant="body1"
        component="p"
        style={{
          marginTop: 14,
        }}
      >
        <a href={props.homepage}>{props.homepageLabel}</a>
      </Typography>
    )}
    {!props.noSourceLink && (!props.homepage || !props.homepageLabel) && (
      <div>
        <Typography
          variant="subtitle1"
          color="textSecondary"
          style={{ marginTop: 20, marginBottom: 10 }}
        >
          Source
        </Typography>
        <Typography variant="body1" component="p">
          <a href={props.url}>{props.url}</a>
        </Typography>
      </div>
    )}
    <hr
      style={{
        background: '#BDBDBD',
        height: 1,
        border: 'none',
        marginTop: 20,
      }}
    />
    <Grid
      container
      direction="row"
      justify="flex-start"
      alignItems="flex-start"
    >
      {props.canSave && !props.hasResource ? (
        <Grid item xs={12} style={{ margin: 5 }}>
          <Button
            variant="text"
            color="primary"
            onClick={props.onSaveButtonClicked}
            title="Download timeline"
          >
            <CloudDownload nativeColor="#FF4081" style={{ marginRight: 20 }} />
            Download this timeline
          </Button>
        </Grid>
      ) : null}
      {props.canErase && !props.hasResource ? (
        <Grid item xs={12} style={{ margin: 5 }}>
          <Button
            variant="text"
            color="primary"
            onClick={props.onEraseButtonClicked}
            title="Start timeline over"
          >
            <RestorePage nativeColor="#303F9F" style={{ marginRight: 20 }} />
            Start this timeline over
          </Button>
        </Grid>
      ) : (
        <Grid item xs={12} style={{ margin: 5 }}>
          <Button
            variant="text"
            color="primary"
            onClick={props.undoAll}
            disabled={!props.undoAll}
            title="Revert changes"
          >
            <RestorePage
              nativeColor={props.undoAll ? '#303F9F' : '#bbb'}
              style={{ marginRight: 20 }}
            />
            Revert changes
          </Button>
        </Grid>
      )}
    </Grid>
  </div>
);

ProjectMetadataDisplay.propTypes = {
  manifestLabel: PropTypes.string,
  manifestSummary: PropTypes.string,
  url: PropTypes.string,
  homepage: PropTypes.string,
  homepageLabel: PropTypes.string,
  noSourceLink: PropTypes.bool,
  onEditClick: PropTypes.func,
  onSaveButtonClicked: PropTypes.func,
  onEraseButtonClicked: PropTypes.func,
  canErase: PropTypes.bool,
  canSave: PropTypes.bool,
  hasResource: PropTypes.bool,
};

export default ProjectMetadataDisplay;
