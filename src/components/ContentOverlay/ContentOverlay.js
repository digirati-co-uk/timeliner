import React, { useState } from 'react';
import PropTypes from 'prop-types';
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';

import './ContentOverlay.scss';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/es/DialogActions/DialogActions';
import Button from '@material-ui/core/es/Button/Button';

const ContentOverlay = props => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="content-overlay">
      {props.error.code ? (
        <Dialog open={true} aria-labelledby="form-dialog-title">
          <DialogTitle>We are unable to play this content</DialogTitle>
          <DialogContent>
            <DialogContentText style={{ color: 'red', marginBottom: 20 }}>
              {props.error.description}
            </DialogContentText>
            <DialogContentText>
              <a href={props.audioUrl} target="_blank">
                {props.audioUrl}
              </a>
            </DialogContentText>
            <DialogContentText>
              Please refresh the page to try another resource.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              color="primary"
              variant="outlined"
              onClick={() => setDismissed(true)}
            >
              Continue anyway
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={() => window.location.reload(true)}
            >
              Refresh page
            </Button>
          </DialogActions>
        </Dialog>
      ) : !props.isLoaded ? (
        <LoadingIndicator loadingPercent={props.loadingPercent} />
      ) : (
        ''
      )}
    </div>
  );
};
ContentOverlay.propTypes = {
  loadingPercent: PropTypes.number.isRequired,
  error: PropTypes.object,
  audioUrl: PropTypes.string,
  isLoaded: PropTypes.bool,
  onContinue: PropTypes.func,
};

export default ContentOverlay;
