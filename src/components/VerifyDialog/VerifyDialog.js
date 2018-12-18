import React from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from '@material-ui/core';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class VerifyDialog extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    cancelText: PropTypes.string,
    agreeText: PropTypes.string,
    onProceed: PropTypes.func.isRequired,
  };

  static defaultProps = {
    cancelText: 'Cancel',
    agreeText: 'Ok',
    open: false,
  };
  render() {
    const {
      open,
      onClose,
      title,
      description,
      cancelText,
      agreeText,
      onProceed,
    } = this.props;
    return (
      <Dialog
        open={open}
        TransitionComponent={Transition}
        onClose={onClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{title}</DialogTitle>
        {description && (
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              {description}
            </DialogContentText>
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={onClose} color="primary">
            {cancelText}
          </Button>
          <Button onClick={onProceed} color="primary">
            {agreeText}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default VerifyDialog;
