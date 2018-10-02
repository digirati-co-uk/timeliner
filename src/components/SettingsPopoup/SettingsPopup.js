import voca from 'voca';
import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Button,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
} from '@material-ui/core';
import Slider from '@material-ui/lab/Slider';

import {
  PROJECT,
  DEFAULT_SETTINGS,
  BUBBLE_STYLES,
} from '../../constants/project';

export default class SettingsPopup extends React.Component {
  static propTypes = {
    /** Callback for when settings saved */
    onSave: PropTypes.func.isRequired,
    /** Callback to dismiss the form */
    onClose: PropTypes.func.isRequired,
    /** is the dialog open */
    open: PropTypes.bool,
    /** initial settings state */
    settings: PropTypes.object,
  };

  static defaultProps = {
    open: false,
  };

  state = {
    ...DEFAULT_SETTINGS,
  };

  handleChange = (name, type) => event => {
    this.setState({
      [name]: type === 'checkbox' ? event.target.checked : event.target.value,
    });
  };

  handleSliderChange = (event, value) => {
    this.setState({
      bubbleHeight: value,
    });
  };

  onSaveClicked = () => {
    this.props.onSave(this.state);
    this.props.onClose();
  };

  getSnapshotBeforeUpdate(prevProps, prevState) {
    if (prevProps.open === false && this.props.open) {
      this.setState({ ...prevProps.settings });
    }
    return null;
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.onClose}
        aria-labelledby="form-dialog-title"
        fullWidth={true}
        maxWidth={'md'}
      >
        <DialogTitle>Settings</DialogTitle>
        <DialogContent
          style={{
            maxWidth: 'none',
          }}
        >
          <div
            style={{
              paddingTop: 16,
              paddingLeft: 8,
            }}
          >
            <Grid
              container
              direction="row"
              justify="stretch"
              alignItems="stretch"
              spacing={16}
              style={{
                width: 700,
              }}
            >
              <Grid item md={6} sm={12}>
                <Grid
                  container
                  direction="column"
                  justify="flex-start"
                  spacing={16}
                >
                  <Grid item>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">
                        Timeline Appearance
                      </FormLabel>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={this.state[PROJECT.SHOW_TIMES]}
                              onChange={this.handleChange(
                                PROJECT.SHOW_TIMES,
                                'checkbox'
                              )}
                              value={PROJECT.SHOW_TIMES}
                            />
                          }
                          label="Show Times"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={this.state[PROJECT.BLACK_N_WHITE]}
                              onChange={this.handleChange(
                                PROJECT.BLACK_N_WHITE,
                                'checkbox'
                              )}
                              value={PROJECT.BLACK_N_WHITE}
                            />
                          }
                          label="Black and White"
                        />
                        <FormControl component="fieldset">
                          <FormLabel component="legend">Bubble Shape</FormLabel>
                          <RadioGroup
                            aria-label="bubble shape"
                            name={PROJECT.BUBBLE_STYLE}
                            value={this.state[PROJECT.BUBBLE_STYLE]}
                            onChange={this.handleChange(PROJECT.BUBBLE_STYLE)}
                          >
                            <FormControlLabel
                              value={BUBBLE_STYLES.ROUNDED}
                              control={<Radio color="primary" />}
                              label={voca.capitalize(BUBBLE_STYLES.ROUNDED)}
                              labelPlacement="end"
                            />
                            <FormControlLabel
                              value={BUBBLE_STYLES.SQUARE}
                              control={<Radio color="primary" />}
                              label={voca.capitalize(BUBBLE_STYLES.SQUARE)}
                              labelPlacement="end"
                            />
                          </RadioGroup>
                        </FormControl>
                      </FormGroup>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={6} sm={12}>
                <Grid
                  container
                  direction="column"
                  justify="flex-start"
                  spacing={16}
                >
                  <Grid item>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Bubble Height</FormLabel>
                      <FormGroup>
                        <Slider
                          onChange={this.handleSliderChange}
                          value={this.state.bubbleHeight}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={this.state[PROJECT.AUTO_SCALE_HEIGHT]}
                              onChange={this.handleChange(
                                PROJECT.AUTO_SCALE_HEIGHT,
                                'checkbox'
                              )}
                              value={PROJECT.AUTO_SCALE_HEIGHT}
                            />
                          }
                          label="Auto Scale Height On Resize"
                        />
                      </FormGroup>
                    </FormControl>
                  </Grid>
                  <Grid item>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">
                        Bubble Level Colours
                      </FormLabel>
                      <FormGroup>TODO: Colour theme editor</FormGroup>
                    </FormControl>
                  </Grid>
                  <Grid item>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Audio Settings</FormLabel>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={
                                this.state[
                                  PROJECT.START_PLAYING_WHEN_BUBBLES_CLICKED
                                ]
                              }
                              onChange={this.handleChange(
                                PROJECT.START_PLAYING_WHEN_BUBBLES_CLICKED,
                                'checkbox'
                              )}
                              value={PROJECT.START_PLAYING_WHEN_BUBBLES_CLICKED}
                            />
                          }
                          label="Start playing when bubble is clicked."
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={
                                this.state[PROJECT.STOP_PLAYING_END_OF_SECTION]
                              }
                              onChange={this.handleChange(
                                PROJECT.STOP_PLAYING_END_OF_SECTION,
                                'checkbox'
                              )}
                              value={PROJECT.STOP_PLAYING_END_OF_SECTION}
                            />
                          }
                          label="Stop Playing at the end of the section."
                        />
                      </FormGroup>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={this.onSaveClicked}
            variant="contained"
            color="primary"
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
