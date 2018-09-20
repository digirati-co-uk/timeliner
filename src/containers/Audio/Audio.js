import React, { Component } from 'react';
import Sound from 'react-sound';
import { connect } from 'react-redux';

import {
  audioLoading,
  audioLoaded,
  changeAudio,
  audioError,
} from '../../actions/canvas';

class Audio extends Component {
  handleSongLoading = params => {
    const { bytesLoaded, bytesTotal, duration, durationEstimate } = params;
    console.log('params', bytesLoaded, bytesTotal, duration, durationEstimate);
    this.props.audioLoading(
      bytesLoaded,
      bytesTotal,
      duration || durationEstimate
    );
  };

  handleSongPlaying = ({ position, duration }) => {};
  handleSongFinishedPlaying = ({ position, duration }) => {};

  render() {
    const { url, isPalying } = this.props;
    return (
      <Sound
        url={url}
        loop={false}
        autoLoad={true}
        playStatus={isPalying ? Sound.status.PLAYING : Sound.status.PAUSED}
        onLoading={this.handleSongLoading}
        onPlaying={this.handleSongPlaying}
        onFinishedPlaying={this.handleSongFinishedPlaying}
      />
    );
  }
}

const mapStateProps = state => ({
  url: state.canvas.url,
  isPalying: state.viewState.isPalying,
});

const mapDispatchToProps = {
  audioLoading,
  audioLoaded,
  changeAudio,
  audioError,
};

export default connect(
  mapStateProps,
  mapDispatchToProps
)(Audio);
