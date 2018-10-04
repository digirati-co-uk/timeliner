import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField, Button, Grid } from '@material-ui/core';
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
      <form>
        <TextField
          id="manifestLabel"
          label="Label"
          InputLabelProps={{
            shrink: true,
          }}
          placeholder="Placeholder"
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
          placeholder="Placeholder"
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
              flex: 1,
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
