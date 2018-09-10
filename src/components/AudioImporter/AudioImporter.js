import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import importResource from './AudioImporter.Utils';

class AudioImporter extends Component {
  static propTypes = {
    /** Callback for when a manifest is imported, receives manifest object */
    onImport: PropTypes.func.isRequired,
    /** On close */
    onClose: PropTypes.func.isRequired,
    /** is the dialog open */
    open: false,
  };

  state = {
    error: '',
  };

  onImportResource = () => {
    const { onImport } = this.props;
    importResource(this.importUrlField.value)
      .then(manifest => onImport(manifest))
      .catch(error => this.setState({ error }));
  };

  onKeyPress = () => {
    this.setState({ error: '' });
  };

  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.onClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle>Import Audio/Manifest</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide a web compatible audio file url or a previously saved
            manifest.
          </DialogContentText>
          <TextField
            inputRef={x => (this.importUrlField = x)}
            autoFocus
            margin="dense"
            id="name"
            label="Audio or Manifest url"
            type="url"
            onKeyPress={this.onKeyPress}
            fullWidth
          />
          {this.state.error && (
            <Typography variant="body1" color="error">
              {this.state.error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={this.onImportResource} color="primary">
            Import
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default AudioImporter;
