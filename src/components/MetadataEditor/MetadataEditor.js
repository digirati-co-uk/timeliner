import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField, Button } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import bem from '@fesk/bem-js';
import PrimaryButton from '../PrimaryButton/PrimaryButton';
import './MetadataEditor.scss';

const metadataEditor = bem.block('metadata-editor');

class MetadataEditor extends Component {
  static propTypes = {
    /** Current label of the manifest or range */
    label: PropTypes.string.isRequired,
    /** Current summary of the manifest or range */
    summary: PropTypes.string.isRequired,
    /** Call back when save button is clicked, gets passed an object with label and summary */
    onSave: PropTypes.func.isRequired,
    /** Call back when delete button is clicked, gets passed an object with label and summary */
    onDelete: PropTypes.func.isRequired,
    /** Is new */
    isNew: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    isNew: true,
    label: 'Untitled',
    summary: '',
  };

  constructor(props) {
    super(props);
    const { label, summary } = props;
    this.state = {
      label,
      summary,
    };
  }

  handleChange = name => ev => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    const { isNew, onSave, onDelete } = this.props;
    const { label, summary } = this.state;
    return (
      <form className={metadataEditor}>
        <TextField
          id="label"
          label="Label"
          InputLabelProps={{
            shrink: true,
          }}
          placeholder="Placeholder"
          fullWidth
          margin="normal"
          value={label}
          onChange={this.handleChange('label')}
        />
        <TextField
          id="summary"
          name="summary"
          label="Description"
          InputLabelProps={{
            shrink: true,
          }}
          placeholder="Placeholder"
          fullWidth
          multiline={true}
          margin="normal"
          value={summary}
          onChange={this.handleChange('summary')}
        />
        <div className={metadataEditor.element('button-bar')}>
          <Button disabled={isNew} onClick={!isNew && onDelete}>
            <Delete /> Delete
          </Button>
          <PrimaryButton onClick={onSave}>Save</PrimaryButton>
        </div>
      </form>
    );
  }
}

export default MetadataEditor;
