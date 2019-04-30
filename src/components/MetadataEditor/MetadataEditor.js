import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import bem from '@fesk/bem-js';
import PrimaryButton from '../PrimaryButton/PrimaryButton';
import ColourSwatchPicker from '../ColourSwatchPicker/ColourSwatchPicker';
import TimePicker from '../TimePicker/TimePicker';
import './MetadataEditor.scss';

const metadataEditor = bem.block('metadata-editor');

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
    /** White label text */
    whiteText: PropTypes.bool,
  };

  static defaultProps = {
    isNew: true,
    label: '',
    summary: '',
    colour: 0,
    whiteText: false,
  };

  constructor(props) {
    super(props);
    const { label, summary, startTime, endTime, whiteText } = props;
    this.state = {
      label,
      summary,
      startTime,
      endTime,
      whiteText,
    };
  }

  handleChange = (name, type) => event => {
    this.setState({
      [name]: type === 'checkbox' ? event.target.checked : event.target.value,
    });
  };

  handleTimePickerChange = name => value => {
    this.setState({
      [name]: value,
    });
  };

  onSelectColour = colour => {
    this.setState({ colour });
  };

  onSave = () => {
    const { colour, label, summary, whiteText } = this.state;
    const state = this.state;
    const newValues = {
      label,
      summary,
      whiteText,
    };
    const startTime = state.startTime;
    const endTime = state.endTime;
    if (startTime !== this.props.startTime) {
      newValues.startTime = startTime;
    }
    if (endTime !== this.props.endTime) {
      newValues.endTime = endTime;
    }
    newValues.colour = colour || this.props.colour;
    this.props.onSave(this.props.id, newValues);
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

  render() {
    const { swatch, onCancel } = this.props;
    const {
      label,
      summary,
      colour,
      startTime,
      endTime,
      whiteText,
    } = this.state;
    return (
      <form className={metadataEditor} onKeyDown={this.handleKeyDown}>
        <TextField
          id="label"
          autoFocus={true}
          label="Label"
          InputLabelProps={{
            shrink: true,
          }}
          placeholder="Untitled section"
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
          placeholder="Section description"
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
                onChange={this.handleTimePickerChange('startTime')}
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
                onChange={this.handleTimePickerChange('endTime')}
              />
            </FormControl>
          </Grid>
          <Grid item>
            <ColourSwatchPicker
              swatch={swatch}
              label="Color"
              currentColour={colour || this.props.colour}
              onSelectColour={this.onSelectColour}
            />
          </Grid>
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  checked={whiteText}
                  onChange={this.handleChange('whiteText', 'checkbox')}
                  color="primary"
                />
              }
              label="White label color"
            />
          </Grid>
          <Grid
            item
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              flex: '1 1 0px',
            }}
          >
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
