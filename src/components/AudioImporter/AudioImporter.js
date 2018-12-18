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
    onClose: PropTypes.func,
    /** is the dialog open */
    open: PropTypes.bool,
  };

  static defaultProps = {
    open: false,
  };

  state = {
    error: '',
  };

  importUrlField = React.createRef();

  onImportResource = () => {
    const { onImport } = this.props;
    const resourceUri = this.importUrlField.value;
    importResource(resourceUri)
      .then(manifest => {
        onImport(manifest, resourceUri);
      })
      .catch(error => this.setState({ error }));
  };

  onKeyPress = () => {
    this.setState({ error: '' });
  };

  render() {
    const { open, onClose } = this.props;
    const { error } = this.state;

    return (
      <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
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
            id="manifestUrl"
            name="manifestUrl"
            label="Audio or Manifest url"
            type="url"
            onKeyPress={this.onKeyPress}
            fullWidth
          />
          {error && (
            <Typography variant="body1" color="error">
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button disabled={!onClose} onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={this.onImportResource}
            variant="contained"
            color="primary"
          >
            Import
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default AudioImporter;
