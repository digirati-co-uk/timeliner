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
import FileUpload from '../FileUpload/FileUpload';

class AudioImporter extends Component {
  static propTypes = {
    /** Callback for when a manifest is imported, receives manifest object */
    onImport: PropTypes.func.isRequired,
    /** On close */
    onClose: PropTypes.func,
    /** is the dialog open */
    open: PropTypes.bool,
    /** Error state from the parent */
    error: PropTypes.string,
  };

  static defaultProps = {
    open: false,
    error: '',
  };

  state = {
    localFile: false,
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

  handleKeyDown = e => {
    if (e.keyCode === 13) {
      this.onImportResource();
    }
  };

  toggleLocalFile = () => {
    this.setState(s => ({ localFile: !s.localFile }));
  };

  handleLocalImport = data => {
    const { onImport } = this.props;

    try {
      onImport(data, data['@id']);
    } catch (err) {
      this.setState({ error: err });
    }
  };

  render() {
    const { open, onClose } = this.props;
    const { localFile } = this.state;
    const error = this.state.error || this.props.error;

    return (
      <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
        <DialogTitle>Import Audio/Manifest</DialogTitle>
        <DialogContent>
          <form onKeyDown={this.handleKeyDown}>
            <DialogContentText>
              Please provide a web compatible audio file url or a previously
              saved manifest.
            </DialogContentText>
            {localFile ? (
              <FileUpload onChange={this.handleLocalImport} />
            ) : (
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
            )}
            <div
              style={{ fontSize: 12, marginTop: 15, cursor: 'pointer' }}
              onClick={this.toggleLocalFile}
            >
              {localFile ? (
                <span>Go back to URL import</span>
              ) : (
                <span>Alternatively, click here to import local file</span>
              )}
            </div>
            {error && (
              <Typography variant="body1" color="error">
                {error}
              </Typography>
            )}
          </form>
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
