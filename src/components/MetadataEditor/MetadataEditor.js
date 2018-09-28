import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField, Button, Grid } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import bem from '@fesk/bem-js';
import PrimaryButton from '../PrimaryButton/PrimaryButton';
import ColourSwatchPicker from '../ColourSwatchPicker/ColourSwatchPicker';

import './MetadataEditor.scss';

const metadataEditor = bem.block('metadata-editor');

//TODO: implement themes
const getSelectedThemeColours = () => ['red', 'blue', 'green'];

const msToTimeStr = ms => {
  const sec = '0' + Math.floor(ms / 1000); //in s
  const min = '0' + Math.floor(ms / 60 / 1000); //in minutes
  const h = '0' + Math.floor(ms / 3600 / 1000); // hours
  return [h.slice(-2), min.slice(-2), sec.slice(-2)].join(':');
};

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
      startTime: startTime || 0,
      endTime: endTime || 1,
    };
  }

  handleChange = name => ev => {
    console.log('handleChange', name, ev.target.value);
    const value =
      name === 'startTime' || name === 'endTime'
        ? timeStrToMs(ev.target.value) || 0
        : ev.target.value;
    this.setState({
      [name]: value,
    });
  };

  onSelectColour = colour => {
    this.setState({ colour });
  };

  onSave = () => {
    this.props.onSave(this.props.id, this.state);
  };

  render() {
    const { isNew, onDelete } = this.props;
    const { label, summary, colour, startTime, endTime } = this.state;
    const colours = getSelectedThemeColours();
    console.log('msToTimeStr(endTime)', msToTimeStr(endTime));
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
              value={msToTimeStr(startTime)}
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
              value={msToTimeStr(endTime)}
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
        </Grid>
        <div className={metadataEditor.element('button-bar')}>
          <Button disabled={!onDelete} onClick={onDelete}>
            <Delete /> Delete
          </Button>
          <PrimaryButton disabled={!this.props.onSave} onClick={this.onSave}>Save</PrimaryButton>
        </div>
      </form>
    );
  }
}

export default MetadataEditor;
