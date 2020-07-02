import React from 'react';
import Button from '@material-ui/core/Button';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';

const MarkerModal = ({
  visible,
  displayMarkerModal,
  currentTime,
  onAddMarker,
}) => {
  
  // const [openDialog, setOpenDialog] = React.useState(false);
  const [label, setLabel] = React.useState(null);
  const [summary, setSummary] = React.useState(null);


  const closeDialog = () => {
    // setOpenDialog(false);
    displayMarkerModal(false);
    // setLabel(null);
    // setSummary(null);
    console.log("Inside closeDialog after closing, visible = " + visible);
  };

  const onConfirm = () => {
    console.log("Inside onConfirm before closing, visible = " + visible + ", label = " + label + ", summary = " + summary);
    onAddMarker(label, summary, currentTime);
    closeDialog();
    // setOpenDialog(false);
  };

  // setOpenDialog(visible);
  console.log("Inside MarkerModal, visible = " + visible + ", currentTime = " + currentTime);

  return (
    <Dialog open={visible} onClose={closeDialog} aria-labelledby="form-dialog-title">
      <DialogTitle>New Named Entity</DialogTitle>
      <DialogContent>
        {/* <DialogContentText>
          Enter field values:
        </DialogContentText> */}
        <TextField autoFocus margin="dense" label="Text" name="label"/>
        <TextField autoFocus margin="dense" label="Type" name="summary"/>       
      </DialogContent>
      <DialogActions>}
        <Button color="primary" onClick={closeDialog}>
          Cancel
        </Button>
        <Button color="primary" onClick={onConfirm}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MarkerModal;
