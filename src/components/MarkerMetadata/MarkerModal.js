import React from 'react';
import Button from '@material-ui/core/Button';
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
  console.log("Inside MarkerModal, visible = " + visible + ", currentTime = " + currentTime);

  const [label, setLabel] = React.useState('');
  const [summary, setSummary] = React.useState('');


  const closeDialog = () => {
    displayMarkerModal(false);
    setLabel('');
    setSummary('');
    console.log("Inside closeDialog after closing, visible = " + visible);
  };

  const onConfirm = () => {
    console.log("Inside onConfirm before closing, visible = " + visible + ", label = " + label + ", summary = " + summary);
    onAddMarker(label, summary, currentTime);
    closeDialog();
  };

 
  return (
    <Dialog open={visible} onClose={closeDialog} aria-labelledby="form-dialog-title">
      <DialogTitle>Create Named Entity</DialogTitle>
      <DialogContent>
        <TextField autoFocus label="Text" value={label} onChange={e => setLabel(e.target.value)}/>
        <TextField label="Type" value={summary} onChange={e => setSummary(e.target.value)} />       
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
