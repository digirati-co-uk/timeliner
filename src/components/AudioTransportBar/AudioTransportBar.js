import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
    /** Add bubble handle splits the first selected bubble in the middle */
    onAddBubble: PropTypes.func,
    /** Creates a group if multiple items selected */
    onGroupBubble: PropTypes.func,
    /** Deletes the selected bubble */
    onDeleteBubble: PropTypes.func,
  };

  keyboardListener = e => {
    if (
      e.target &&
      ['INPUT', 'BUTTON', 'TEXTAREA'].indexOf(e.target.tagName) !== -1
    ) {
      return;
    }

    switch (e.keyCode) {
      case 37: //left
        return this.props.onScrubBackwards();
      case 39: // right
        return this.props.onScrubAhead();
      case 40: //down
      case 38: // top

      case 32: // space-bar
        return this.props.isPlaying
          ? this.props.onPause()
          : this.props.onPlay();
      default:
        return;
    }
  };

  componentDidMount() {
    document.addEventListener('keydown', this.keyboardListener);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keyboardListener);
  }

  render() {
    return (
      <div className="audio-transport-bar">
        <Grid container direction="row" alignItems="center">
          <Grid item xs={4} className="audio-transport-bar__actions">
            <CurrentTimeIndicator
              currentTime={this.props.currentTime}
              runtime={this.props.runTime}
            />
            <PrimaryButton
              disabled={!this.props.onAddBubble}
              onClick={this.props.onAddBubble}
            >
              Add
            </PrimaryButton>
            <PrimaryButton
              disabled={!this.props.onGroupBubble}
              onClick={this.props.onGroupBubble}
              style={{
                marginLeft: 16,
              }}
            >
              Group
            </PrimaryButton>
            <PrimaryButton
              disabled={!this.props.onDeleteBubble}
              onClick={this.props.onDeleteBubble}
              style={{
                marginLeft: 16,
              }}
            >
              Delete
            </PrimaryButton>
          </Grid>
          <Grid item xs={4}>
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
          <Grid item xs={4} className="audio-transport-bar__volume">
            <VolumeSlider
              volume={this.props.volume}
              onVolumeChanged={this.props.onVolumeChanged}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default AudioTransportBar;
