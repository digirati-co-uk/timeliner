import React, { Component } from 'react';
import Sound from 'react-sound';
import formatDate from 'date-fns/format';

const Scrubber = ({ duration, onScrub, position }) => {
  return (
    <div
      onClick={e => {
        const bounds = e.target.getBoundingClientRect();
        const x = e.clientX - bounds.left;
        const percent = x / 500;
        if (onScrub) {
          onScrub(percent * duration);
        }
      }}
      style={{ position: 'relative', height: 30, width: 500 }}
    >
      <div
        style={{
          background: '#000',
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}
      />
      <div
        style={{
          background: '#0767FB',
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: `${(position / duration) * 100}%`,
        }}
      />
    </div>
  );
};

class ReactSound extends Component {
  state = {
    loading: false,
    status: Sound.status.PAUSED,
    percent: 0,
    duration: 1,
  };

  handleSongPlaying = ({ position }) => {
    this.setState({ position });
  };

  play = () => {
    this.setState({ status: Sound.status.PLAYING });
  };

  stop = ({ position }) => {
    this.setState({ status: Sound.status.PAUSED, position });
  };

  goToOneMinute = () => {
    this.setState({ position: 60 * 1000 });
  };

  scrub = e => {
    const bounds = e.target.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const percent = x / 500;
    this.setState({ position: percent * this.state.duration });
  };

  render() {
    return (
      <div>
        Time: {formatDate(new Date(this.state.position || 1), 'mm:ss')} /{' '}
        {formatDate(new Date(this.state.duration), 'mm:ss')}
        <Scrubber
          onScrub={position => {
            this.play();
            this.setState({ position });
          }}
          duration={this.state.duration}
          position={this.state.position}
        />
        <button onClick={this.play}>Play</button>
        <button onClick={this.stop}>Stop</button>
        <button onClick={this.goToOneMinute}>Go to one minute</button>
        <Sound
          url={this.props.url}
          playStatus={this.state.status}
          position={this.state.position}
          onLoading={({ bytesLoaded, bytesTotal }) => {
            this.setState({ percent: (bytesLoaded / bytesTotal) * 100 });
          }}
          onLoad={({ duration }) => {
            this.setState({ duration });
          }}
          onPlaying={this.handleSongPlaying}
        />
      </div>
    );
  }
}

export default ReactSound;
