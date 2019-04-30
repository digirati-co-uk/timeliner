import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import PrimaryButton from '../PrimaryButton/PrimaryButton';

class ProjectMetadataEditor extends Component {
  static propTypes = {
    /** Current label of the manifest or range */
    manifestLabel: PropTypes.string.isRequired,
    /** Current summary of the manifest or range */
    manifestSummary: PropTypes.string.isRequired,
    /** Call back when save button is clicked, gets passed an object with label and summary */
    onSave: PropTypes.func,
    /** Call back when delete button is clicked, gets passed an object with label and summary */
    onCancel: PropTypes.func,
  };

  static defaultProps = {
    manifestLabel: 'Untitled',
    manifestSummary: '',
  };

  handleKeyDown = e => {
    if (e.target && e.target.tagName === 'TEXTAREA') {
      return;
    }
    if (e.keyCode === 13) {
      this.onSave();
    }
    if (e.keyCode === 27) {
      this.props.onCancel();
    }
  };

  constructor(props) {
    super(props);
    const { manifestLabel, manifestSummary } = props;
    this.state = {
      manifestLabel,
      manifestSummary,
    };
  }

  handleChange = name => ev => {
    this.setState({
      [name]: ev.target.value,
    });
  };

  onSave = () => {
    const { manifestLabel, manifestSummary } = this.state;
    const newValues = {
      manifestLabel,
      manifestSummary,
    };
    this.props.onSave(newValues);
  };

  render() {
    const { onCancel } = this.props;
    const { manifestLabel, manifestSummary } = this.state;
    return (
      <form onKeyDown={this.handleKeyDown} style={{ paddingRight: 20 }}>
        <TextField
          id="manifestLabel"
          label="Label"
          autoFocus={true}
          InputLabelProps={{
            shrink: true,
          }}
          placeholder="Unnamed manifest"
          fullWidth
          margin="normal"
          value={manifestLabel}
          onChange={this.handleChange('manifestLabel')}
        />
        <TextField
          id="manifestSummary"
          name="manifestSummary"
          label="Description"
          InputLabelProps={{
            shrink: true,
          }}
          placeholder="Description of timeline"
          fullWidth
          multiline={true}
          margin="normal"
          value={manifestSummary}
          onChange={this.handleChange('manifestSummary')}
        />
        <Grid
          container
          spacing={16}
          direction="row"
          justify="flex-start"
          alignItems="center"
        >
          <Grid
            item
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              flex: '1 1 0px',
            }}
          >
            <Button disabled={!this.props.onCancel} onClick={onCancel}>
              Cancel
            </Button>
            <PrimaryButton disabled={!this.props.onSave} onClick={this.onSave}>
              Save
            </PrimaryButton>
          </Grid>
        </Grid>
      </form>
    );
  }
}

export default ProjectMetadataEditor;
