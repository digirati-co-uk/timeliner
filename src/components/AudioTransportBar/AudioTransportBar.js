import React, { Component } from 'react';
import PropTypes from 'prop-types';
import VolumeSlider from '../VolumeSlider/VolumeSlider';
import CurrentTimeIndicator from '../CurrentTimeIndicator/CurrentTimeIndicator';
import NextButton from '../NextButton/NextButton';
import PreviousButton from '../PreviousButton/PreviousButton';
import SkipAheadButton from '../SkipAheadButton/SkipAheadButton';
import SkipBackwardsButton from '../SkipBackwardsButton/SkipBackwardsButton';
import PlayPauseButton from '../PlayPauseButton/PlayPauseButton';
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
  };

  render() {
    return (
      <div className="audio-transport-bar">
        <CurrentTimeIndicator currentTime={43 * 1000} runtime={180 * 1000} />
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
        <VolumeSlider />
      </div>
    );
  }
}

export default AudioTransportBar;
