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
import MergeButton from '../MergeButton/MergeButton';
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
      <Toolbar className="audio-transport-bar">
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid item>
            <CurrentTimeIndicator
              currentTime={this.props.currentTime}
              runtime={this.props.runTime}
            />
            <MergeButton />
          </Grid>
          <Grid item>
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
          <Grid item>
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
