import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField, Button, Grid } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import formatDate from 'date-fns/format';
import bem from '@fesk/bem-js';
import PrimaryButton from '../PrimaryButton/PrimaryButton';
import ColourSwatchPicker from '../ColourSwatchPicker/ColourSwatchPicker';

import './MetadataEditor.scss';

const metadataEditor = bem.block('metadata-editor');
const DISPLAY_TIME_FORMAT = 'HH:mm:ss';

//TODO: implement themes
const getSelectedThemeColours = () => ['red', 'blue', 'green'];

const timeStrToMs = timeStr => {
  var hms = timeStr.split(':');
  return (
    parseInt(hms[0], 10) * 3600 * 1000 +
    parseInt(hms[1], 10) * 60 * 1000 +
    parseInt(hms[2], 10) * 1000
  );
};

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
    label: 'Unnamed Range',
    summary: '',
    colour: 0,
  };

  constructor(props) {
    super(props);
    const { label, summary, colour, startTime, endTime } = props;
    const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;
    this.state = {
      label,
      summary,
      colour,
      startTime: formatDate(
        new Date(startTime + timezoneOffset),
        DISPLAY_TIME_FORMAT
      ),
      endTime: formatDate(
        new Date(endTime + timezoneOffset),
        DISPLAY_TIME_FORMAT
      ),
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
    const startTime = timeStrToMs(state.startTime);
    const endTime = timeStrToMs(state.endTime);
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
            <TextField
              id="startTime"
              label="Start Time"
              type="time"
              defaultValue={startTime}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 1, // 5 min
              }}
              onChange={this.handleChange('startTime')}
            />
          </Grid>
          <Grid item>
            <TextField
              id="endTime"
              label="End Time"
              type="time"
              defaultValue={endTime}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 1, // 5 min
              }}
              onChange={this.handleChange('endTime')}
            />
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
