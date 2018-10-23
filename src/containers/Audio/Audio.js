import React, { Component } from 'react';
import Sound from 'react-sound';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { audioLoading, audioLoaded, audioError } from '../../actions/canvas';

import { ERROR_CODES } from '../../constants/canvas';

import { setCurrentTime, finishedPlaying } from '../../actions/viewState';

class Audio extends Component {
  static propTypes = {
    setCurrentTime: PropTypes.func.isRequired,
    currentTime: PropTypes.number.isRequired,
  };

  static defaultProps = {
    setCurrentTime: () => {},
    currentTime: 0,
  };

  handleSongLoading = params => {
    const { bytesLoaded, bytesTotal, duration, durationEstimate } = params;
    this.props.audioLoading(
      bytesLoaded,
      bytesTotal,
      duration || durationEstimate
    );
  };

  handleSongPlaying = ({ position, duration }) => {
    this.props.setCurrentTime(position);
    if (position === duration) {
      this.props.finishedPlaying();
    }
  };

  handleResumePlaying = ({ position, duration }) => {
    //this.props.setCurrentTime(position);
  };

  handleSongFinishedPlaying = () => {
    // NOTE: we never reach this...
    this.props.finishedPlaying();
  };

  handleOnLoad = obj => {
    const { loaded } = obj;
    this.props.audioLoaded(loaded);
  };

  handleError = (errorCode, description) => {
    this.props.audioError(errorCode, ERROR_CODES[description]);
  };

  render() {
    const { url, isPlaying, volume, currentTime } = this.props;
    const playStatus = isPlaying ? Sound.status.PLAYING : Sound.status.PAUSED;
    if (!url) {
      return null;
    }
    return (
      <Sound
        url={url}
        loop={false}
        autoLoad={true}
        volume={volume}
        playbackRate={1.0}
        position={currentTime}
        playStatus={playStatus}
        onLoading={this.handleSongLoading}
        onLoad={this.handleOnLoad}
        onPlaying={this.handleSongPlaying}
        onFinishedPlaying={this.handleSongFinishedPlaying}
        onStop={this.handleSongFinishedPlaying}
        onResume={this.handleResumePlaying}
        onError={this.handleError}
      />
    );
  }
}

const mapStateProps = state => ({
  url: state.canvas.url,
  isPlaying: state.viewState.isPlaying,
  currentTime: state.viewState.currentTime,
  volume: state.viewState.volume,
});

const mapDispatchToProps = {
  audioLoading,
  audioLoaded,
  audioError,
  setCurrentTime,
  finishedPlaying,
};

export default connect(
  mapStateProps,
  mapDispatchToProps
)(Audio);
