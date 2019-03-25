import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

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
    doCancel: PropTypes.bool,
  };

  static defaultProps = {
    cancelText: 'Cancel',
    agreeText: 'Ok',
    open: false,
    doCancel: true,
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
      doCancel,
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
          {doCancel && (
            <Button onClick={onClose} color="primary">
              {cancelText}
            </Button>
          )}
          <Button onClick={onProceed} color="primary">
            {agreeText}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default VerifyDialog;
