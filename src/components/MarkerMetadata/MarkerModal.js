import React from 'react';
import Button from '@material-ui/core/Button';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';

const MarkerModal = ({
  open,
  currentTime,
  onAddMarker,
}) => {

  const [openDialog, setOpenDialog] = React.useState(open);
  const [label, setLabel] = React.useState(null);
  const [summary, setSummary] = React.useState(null);

  const onCancel = () => {
    setOpenDialog(false);
  };

  const onConfirm = () => {
    onAddMarker(label, summary, currentTime);
    setOpenDialog(false);
  };

  console.log("Inside MarkerModal, open = " + open);

  return (
    <Dialog open={openDialog} onClose={onCancel} aria-labelledby="form-dialog-title">
      <DialogTitle>New Named Entity</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter field values:
        </DialogContentText>
        <TextField autoFocus margin="dense" label="Text" name="label"/>
        <TextField autoFocus margin="dense" label="Type" name="summary"/>       
      </DialogContent>
      <DialogActions>}
        <Button color="primary" onClick={onCancel}>
          Cancel
        </Button>
        <Button color="primary" variant="contained" onClick={onConfirm}>
          Add Entity
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MarkerModal;
