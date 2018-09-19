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

class MetadataEditor extends Component {
  static propTypes = {
    /** Current label of the manifest or range */
    label: PropTypes.string.isRequired,
    /** Current summary of the manifest or range */
    summary: PropTypes.string.isRequired,
    /** Selected theme colour */
    colour: PropTypes.number.isRequired,
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

  defaultProps = {
    startTime: 0,
    endTime: 1,
  };

  handleChange = name => ev => {
    this.setState({
      [name]: ev.target.value,
    });
  };

  onSelectColour = colour => {
    this.setState({ colour });
  };

  onSave = () => this.props.onSave(this.state);

  render() {
    const { isNew, onDelete } = this.props;
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
              defaultValue="00:00"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 1, // 5 min
              }}
            />
          </Grid>
          <Grid item>
            <TextField
              id="endTime"
              label="End Time"
              type="time"
              defaultValue="00:01"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 1, // 5 min
              }}
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
          <Button disabled={isNew} onClick={!isNew && onDelete}>
            <Delete /> Delete
          </Button>
          <PrimaryButton onClick={this.onSave}>Save</PrimaryButton>
        </div>
      </form>
    );
  }
}

export default MetadataEditor;
