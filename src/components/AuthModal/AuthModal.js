import React from 'react';
import Button from '@material-ui/core/Button';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';

const AuthModal = ({
  header,
  description,
  onDismiss,
  dismissLabel = 'cancel',
  onConfirm,
  confirmLabel,
}) => {
  console.log("inside AuthModal");
  return (
    <Dialog open={true} aria-labelledby="form-dialog-title">
      <DialogTitle>{header}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <span dangerouslySetInnerHTML={{ __html: description }} />
        </DialogContentText>
        <DialogActions>
          <Button color="primary" onClick={onDismiss}>
            {dismissLabel}
          </Button>
          <Button color="primary" variant="contained" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
