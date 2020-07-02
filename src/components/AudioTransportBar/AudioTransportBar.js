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
import ZoomControls from '../ZoomControls/ZoomControls';

import './AudioTransportBar.scss';
import VolumeSliderCompact from '../VolumeSliderCompact/VolumeSliderCompact';
import Tooltip from '@material-ui/core/Tooltip';
import GroupWork from '@material-ui/icons/GroupWork';
import Delete from '@material-ui/icons/Delete';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import Add from '@material-ui/icons/Add';

import MarkerModal from '../MarkerMetadata/MarkerModal';

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
    /** Deletes the selected marker */
    onDeleteMarker: PropTypes.func,
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

  markerModalVisible = false;

  render() {
    const {
      onAddBubble,
      onGroupBubble,
      onDeleteBubble,
      onDeleteMarker,
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
      zoom,
      zoomIn,
      zoomOut,
      resetZoom,
    } = this.props;

    const displayMarkerModal = (visible) => {
      this.markerModalVisible = visible;
      this.forceUpdate();
      console.log("calling displayMarkerModal in AudioTransport, markerModalVisible = " + this.markerModalVisible);
    };

    return (
      <div className="audio-transport-bar">
        <Grid container direction="row" alignItems="center">
          <Grid item xs={4} className="audio-transport-bar__actions">
            <CurrentTimeIndicator currentTime={currentTime} runtime={runTime} />
            {/* <PrimaryButton
              disabled={!onAddBubble}
              onClick={onAddBubble}
              style={{ padding: 4 }}
              size="small"
              classes={{
                root: 'audio-transport-bar__button-text',
                label: 'audio-transport-bar__button-text',
              }}
            >
              <Tooltip
                classes={{ tooltip: 'audio-transport-bar__tooltip' }}
                title="Split the current bubble at the current time"
                aria-label="Split the current bubble at the current time"
              >
                <Add />
              </Tooltip>
            </PrimaryButton> */}
            
            <PrimaryButton
              disabled={!onAddMarker}
              onClick={() => displayMarkerModal(true)}
              style={{ marginLeft: 16, padding: 4 }}
              size="small"
              classes={{
                root: 'audio-transport-bar__button-text',
                label: 'audio-transport-bar__button-text',
              }}
            >
              <Tooltip
                classes={{ tooltip: 'audio-transport-bar__tooltip' }}
                title="Add new marker at current time"
                aria-label="Add new marker at current time"
              >
                <ArrowDropUp />
              </Tooltip>
            </PrimaryButton>

            <MarkerModal
              visible={this.markerModalVisible}
              displayMarkerModal={displayMarkerModal}
              currentTime={currentTime}
              onAddMarker={onAddMarker}
            />

            {/* <PrimaryButton
              disabled={!onGroupBubble}
              onClick={onGroupBubble}
              style={{ marginLeft: 16, padding: 4 }}
              size="small"
              classes={{
                root: 'audio-transport-bar__button-text',
                label: 'audio-transport-bar__button-text',
              }}
            >
              <Tooltip
                classes={{ tooltip: 'audio-transport-bar__tooltip' }}
                title="Group bubbles together"
                aria-label="Group bubbles together"
              >
                <GroupWork />
              </Tooltip>
            </PrimaryButton> */}

            {/* <PrimaryButton
              disabled={!onDeleteMarker}
              onClick={onDeleteMarker}
              style={{ marginLeft: 16, padding: 4 }}
              size="small"
              classes={{
                root: 'audio-transport-bar__button-text',
                label: 'audio-transport-bar__button-text',
              }}
            >
              <Tooltip
                classes={{ tooltip: 'audio-transport-bar__tooltip' }}
                title="Delete marker"
                aria-label="Delete marker"
              >
                <Delete />
              </Tooltip>
            </PrimaryButton> */}
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

          <Grid item xs={2} className="audio-transport-bar__zoom">
            <ZoomControls
              onZoomIn={this.props.zoomIn}
              onZoomOut={zoom > 1 ? this.props.zoomOut : null}
              onResetView={zoom !== 1 ? this.props.resetZoom : null}
            />
          </Grid>

          <Grid item xs={2} className="audio-transport-bar__volume">
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
