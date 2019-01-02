import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';

import './ContentOverlay.scss';

const ContentOverlay = props => (
  <div className="content-overlay">
    {props.error.code ? (
      <div>
        <Typography variant="body1" color="error" align="center">
          {props.error.description}
        </Typography>
        <Typography variant="body1" align="center">
          <a href={props.audioUrl} target="_blank">
            {props.audioUrl}
          </a>
        </Typography>
      </div>
    ) : !props.isLoaded ? (
      <LoadingIndicator loadingPercent={props.loadingPercent} />
    ) : (
      ''
    )}
  </div>
);

ContentOverlay.propTypes = {
  loadingPercent: PropTypes.number.isRequired,
  error: PropTypes.object,
  audioUrl: PropTypes.string,
  isLoaded: PropTypes.bool,
};

export default ContentOverlay;
