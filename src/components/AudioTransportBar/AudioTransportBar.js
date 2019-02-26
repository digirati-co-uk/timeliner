import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CurrentTimeIndicator from '../CurrentTimeIndicator/CurrentTimeIndicator';
import NextButton from '../NextButton/NextButton';
import PreviousButton from '../PreviousButton/PreviousButton';
import SkipAheadButton from '../SkipAheadButton/SkipAheadButton';
import SkipBackwardsButton from '../SkipBackwardsButton/SkipBackwardsButton';
import PlayPauseButton from '../PlayPauseButton/PlayPauseButton';
import PrimaryButton from '../PrimaryButton/PrimaryButton';
import Grid from '@material-ui/core/Grid';

import './AudioTransportBar.scss';
import VolumeSliderCompact from '../VolumeSliderCompact/VolumeSliderCompact';

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
    const {
      onAddBubble,
      onGroupBubble,
      onDeleteBubble,
      onAddMarker,
      onPreviousBubble,
      onScrubBackwards,
      isPlaying,
      onPlay,
      onPause,
      onScrubAhead,
      onNextBubble,
      volume,
      onVolumeChanged,
      currentTime,
      runTime,
    } = this.props;

    return (
      <div className="audio-transport-bar">
        <Grid container direction="row" alignItems="center">
          <Grid item xs={4} className="audio-transport-bar__actions">
            <CurrentTimeIndicator currentTime={currentTime} runtime={runTime} />
            <PrimaryButton disabled={!onAddBubble} onClick={onAddBubble}>
              Add
            </PrimaryButton>
            <PrimaryButton
              disabled={!onGroupBubble}
              onClick={onGroupBubble}
              style={{ marginLeft: 16 }}
            >
              Group
            </PrimaryButton>
            <PrimaryButton
              disabled={!onDeleteBubble}
              onClick={onDeleteBubble}
              style={{ marginLeft: 16 }}
            >
              Delete
            </PrimaryButton>
            <PrimaryButton
              disabled={!onAddMarker}
              onClick={onAddMarker}
              style={{ marginLeft: 16 }}
            >
              Marker
            </PrimaryButton>
          </Grid>
          <Grid item xs={4}>
            <div className="audio-transport-bar__buttons">
              <PreviousButton onClick={onPreviousBubble} />
              <SkipBackwardsButton onClick={onScrubBackwards} />
              <PlayPauseButton
                isPlaying={isPlaying}
                onPlay={onPlay}
                onPause={onPause}
              />
              <SkipAheadButton onClick={onScrubAhead} />
              <NextButton onClick={onNextBubble} />
            </div>
          </Grid>
          <Grid item xs={4} className="audio-transport-bar__volume">
            <VolumeSliderCompact
              flipped={true}
              volume={volume}
              onVolumeChanged={onVolumeChanged}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default AudioTransportBar;
