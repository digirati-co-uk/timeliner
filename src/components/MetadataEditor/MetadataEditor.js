import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  TextField,
  Button,
  Grid,
  InputLabel,
  FormControl,
} from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import bem from '@fesk/bem-js';
import PrimaryButton from '../PrimaryButton/PrimaryButton';
import ColourSwatchPicker from '../ColourSwatchPicker/ColourSwatchPicker';
import TimePicker from '../TimePicker/TimePicker';

import './MetadataEditor.scss';

const metadataEditor = bem.block('metadata-editor');

//TODO: implement themes
const getSelectedThemeColours = () => ['red', 'blue', 'green'];

class MetadataEditor extends Component {
  static propTypes = {
    /** Current label of the manifest or range */
    label: PropTypes.string.isRequired,
    /** Current summary of the manifest or range */
    summary: PropTypes.string.isRequired,
    /** Selected theme colour */
    colour: PropTypes.string.isRequired,
    /** Call back when save button is clicked, gets passed an object with label and summary */
    onSave: PropTypes.func,
    /** Call back when delete button is clicked, gets passed an object with label and summary */
    onDelete: PropTypes.func,
    /** on Cancel annotation edit */
    onCancel: PropTypes.func,
    /** Is new */
    isNew: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    isNew: true,
    label: 'Untitled',
    summary: '',
    colour: 0,
  };

  constructor(props) {
    super(props);
    const { label, summary, colour, startTime, endTime } = props;
    this.state = {
      label,
      summary,
      colour,
      startTime,
      endTime,
    };
  }

  handleChange = name => ev => {
    this.setState({
      [name]: ev.target.value,
    });
  };

  onSelectColour = colour => {
    this.setState({ colour });
  };

  onSave = () => {
    const { colour, label, summary } = this.state;
    const state = this.state;
    const newValues = {
      colour,
      label,
      summary,
    };
    const startTime = state.startTime;
    const endTime = state.endTime;
    if (startTime !== this.props.startTime) {
      newValues.startTime = {
        x: startTime,
        originalX: this.props.startTime,
      };
    }
    if (endTime !== this.props.endTime) {
      newValues.endTime = {
        x: endTime,
        originalX: this.props.endTime,
      };
    }
    this.props.onSave(this.props.id, newValues);
  };

  render() {
    const { onDelete, onCancel } = this.props;
    const { label, summary, colour, startTime, endTime } = this.state;
    const colours = getSelectedThemeColours();
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
        <Grid
          container
          spacing={16}
          direction="row"
          justify="flex-start"
          alignItems="center"
        >
          <Grid item>
            <FormControl>
              <InputLabel htmlFor="startTime" shrink>
                Start Time
              </InputLabel>
              <TimePicker
                value={startTime}
                onChange={this.handleChange('startTime')}
              />
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl>
              <InputLabel htmlFor="endTime" shrink>
                End Time
              </InputLabel>
              <TimePicker
                value={endTime}
                onChange={this.handleChange('endTime')}
              />
            </FormControl>
          </Grid>
          <Grid item>
            <ColourSwatchPicker
              swatch={colours}
              label="Colour"
              currentColour={colour}
              onSelectColour={this.onSelectColour}
            />
          </Grid>
          <Grid
            item
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              flex: 1,
            }}
          >
            <Button disabled={!onDelete} onClick={onDelete}>
              <Delete /> Delete
            </Button>
            <Button onClick={onCancel}>Cancel</Button>
            <PrimaryButton disabled={!this.props.onSave} onClick={this.onSave}>
              Save
            </PrimaryButton>
          </Grid>
        </Grid>
      </form>
    );
  }
}

export default MetadataEditor;
