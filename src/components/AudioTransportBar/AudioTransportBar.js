import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Toolbar } from '@material-ui/core';
import VolumeSlider from '../VolumeSlider/VolumeSlider';
import CurrentTimeIndicator from '../CurrentTimeIndicator/CurrentTimeIndicator';
import NextButton from '../NextButton/NextButton';
import PreviousButton from '../PreviousButton/PreviousButton';
import SkipAheadButton from '../SkipAheadButton/SkipAheadButton';
import SkipBackwardsButton from '../SkipBackwardsButton/SkipBackwardsButton';
import PlayPauseButton from '../PlayPauseButton/PlayPauseButton';
import PrimaryButton from '../PrimaryButton/PrimaryButton';
import { Grid } from '@material-ui/core';

import './AudioTransportBar.scss';

class AudioTransportBar extends Component {
  static propTypes = {
    /** Boolean value for the current playing state */
    isPlaying: PropTypes.bool.isRequired,
    /** Handler for play button */
    onPlay: PropTypes.func.isRequired,
    /** Handler for pause button */
    onPause: PropTypes.func.isRequired,
    /** Handler for next button */
    onNextBubble: PropTypes.func.isRequired,
    /** Handler for previous button */
    onPreviousBubble: PropTypes.func.isRequired,
    /** Handler for scrubbing ahead button */
    onScrubAhead: PropTypes.func.isRequired,
    /** Handler for scrubbing backwards button */
    onScrubBackwards: PropTypes.func.isRequired,
    /** Current time */
    currentTime: PropTypes.number.isRequired,
    /** Runtime time */
    runTime: PropTypes.number.isRequired,
  };

  render() {
    return (
      <Toolbar
        className="audio-transport-bar"
        style={{
          marginBottom: 8,
          paddingLeft: 16,
          paddingRight: 16,
        }}
      >
        <Grid container direction="row" justify="stretch" alignItems="center">
          <Grid
            item
            xs="4"
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}
          >
            <CurrentTimeIndicator
              currentTime={this.props.currentTime}
              runtime={this.props.runTime}
            />
            <PrimaryButton>Add</PrimaryButton>
            <PrimaryButton
              disabled={true}
              style={{
                marginLeft: 16,
              }}
            >
              Group
            </PrimaryButton>
            <PrimaryButton
              disabled={true}
              style={{
                marginLeft: 16,
              }}
            >
              Delete
            </PrimaryButton>
          </Grid>
          <Grid item xs="4">
            <div className="audio-transport-bar__buttons">
              <PreviousButton onClick={this.props.onPreviousBubble} />
              <SkipBackwardsButton onClick={this.props.onScrubBackwards} />
              <PlayPauseButton
                isPlaying={this.props.isPlaying}
                onPlay={this.props.onPlay}
                onPause={this.props.onPause}
              />
              <SkipAheadButton onClick={this.props.onScrubAhead} />
              <NextButton onClick={this.props.onNextBubble} />
            </div>
          </Grid>
          <Grid
            item
            xs="4"
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}
          >
            <VolumeSlider
              volume={this.props.volume}
              onVolumeChanged={this.props.onVolumeChanged}
            />
          </Grid>
        </Grid>
      </Toolbar>
    );
  }
}

export default AudioTransportBar;
