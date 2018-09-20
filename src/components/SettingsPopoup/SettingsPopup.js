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

export default class SettingsPopup extends React.Component {
  static propTypes = {
    /** Callback for when settings saved */
    onSave: PropTypes.func.isRequired,
    /** Callback to dismiss the form */
    onClose: PropTypes.func.isRequired,
    /** is the dialog open */
    open: false,
  };

  state = {
    bubbleHeight: 70,
    showTimes: false,
    blackAndWhite: false,
    bubbleShape: 'round',
    autoScaleHeightOnResize: true,
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
                  {/* 
                  {"These properties are not needed on the web version."}
                  <Grid item>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Timeline is...</FormLabel>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={this.state.editable}
                              onChange={this.handleChange('editable', 'checkbox')}
                              value="editable"
                            />
                          }
                          label="Editable"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={this.state.resizable}
                              onChange={this.handleChange('resizable', 'checkbox')}
                              value="resizable"
                            />
                          }
                          label="Resizable"
                        />
                      </FormGroup>
                    </FormControl>
                  </Grid> */}
                  <Grid item>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">
                        Timeline Appearance
                      </FormLabel>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={this.state.showTimes}
                              onChange={this.handleChange(
                                'showTimes',
                                'checkbox'
                              )}
                              value="showTimes"
                            />
                          }
                          label="Show Times"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={this.state.blackAndWhite}
                              onChange={this.handleChange(
                                'blackAndWhite',
                                'checkbox'
                              )}
                              value="blackAndWhite"
                            />
                          }
                          label="Black and White"
                        />
                        <FormControl component="fieldset">
                          <FormLabel component="legend">Bubble Shape</FormLabel>
                          <RadioGroup
                            aria-label="bubble shape"
                            name="bubbleShape"
                            value={this.state.bubbleShape}
                            onChange={this.handleChange('bubbleShape')}
                          >
                            <FormControlLabel
                              value="round"
                              control={<Radio color="primary" />}
                              label="Round"
                              labelPlacement="end"
                            />
                            <FormControlLabel
                              value="square"
                              control={<Radio color="primary" />}
                              label="Square"
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
                              checked={this.state.autoScaleHeightOnResize}
                              onChange={this.handleChange(
                                'autoScaleHeightOnResize',
                                'checkbox'
                              )}
                              value="autoScaleHeightOnResize"
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
                              checked={this.state.startPlayingWhenBubbleClicked}
                              onChange={this.handleChange(
                                'startPlayingWhenBubbleClicked',
                                'checkbox'
                              )}
                              value="startPlayingWhenBubbleClicked"
                            />
                          }
                          label="Start playing when bubble is clicked."
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={
                                this.state.stopPlayingAtTheEndOfTheSection
                              }
                              onChange={this.handleChange(
                                'stopPlayingAtTheEndOfTheSection',
                                'checkbox'
                              )}
                              value="stopPlayingAtTheEndOfTheSection"
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
          <Button onClick={this.props.onClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={this.onSaveClicked} color="primary">
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
