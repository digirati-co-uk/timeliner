import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class AudioImporter extends Component {
  static propTypes = {
    /** Callback for when a manifest is imported, receives manifest object */
    onImport: PropTypes.func.isRequired,
    /** On close */
    onClose: PropTypes.func.isRequired,
    /** is the dialog open */
    open: false,
    
  };

  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle>Import Audio/Manifest</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide a web compatible audio file url or a previously saved manifest.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Audio or Manifest url"
            type="url"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.props.onImport} color="primary">
            Import
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default AudioImporter;
