import React, { Component } from 'react';
import Sound from 'react-sound';

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

class IIIFAvProvider extends Component {
  state = {
    loading: false,
    loaded: false,
    totalDuration: 0,
    currentDuration: 0,
    content: [],
    status: Sound.status.PAUSED,
  };

  vote = duration => {
    this.setState({ currentDuration: duration });
    // if (
    //   duration > this.state.currentDuration - 10 &&
    //   duration < this.state.currentDuration + 10
    // ) {
    //   this.setState({ currentDuration: duration });
    // }
  };

  componentWillMount() {
    const { url } = this.props;
    this.loadManifest(url);

    // this.clock = setInterval(() => {
    //   if (this.state.status === Sound.status.PLAYING) {
    //     this.setState({
    //       currentDuration: this.state.currentDuration + 1000,
    //     });
    //   }
    // }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.clock);
  }

  loadManifest(url) {
    fetch(url)
      .then(r => r.json())
      .then(manifest => {
        // For this proof of concept, using old fixtures and old P3 version and only rendering first canvas.
        this.setState({
          totalDuration: manifest.sequences.canvases[0].duration * 1000,
          content: manifest.sequences.canvases[0].content[0].items.map(
            content => ({
              id: content.id,
              url: content.body.id,
              time: content.target
                .split('#t=')[1]
                .split(',')
                .map(t => parseInt(t, 10) * 1000),
            })
          ),
        });
      });
  }

  start = () => {
    this.setState({ status: Sound.status.PLAYING });
  };

  getActiveItems() {
    return this.state.content.filter(
      item =>
        item.time[0] <= this.state.currentDuration &&
        item.time[1] > this.state.currentDuration
    );
  }

  reset = () => {
    this.setState({
      currentDuration: 0,
    });
  };

  onPlaying = time => ({ position }) => {
    this.vote(position + time);
  };

  pause = () => {
    this.setState({ status: Sound.status.PAUSED });
  };

  render() {
    return (
      <div>
        <button onClick={this.start}>start</button>
        <button onClick={this.pause}>pause</button>
        <button onClick={this.reset}>reset</button>
        Duration: {this.state.currentDuration} of {this.state.totalDuration}
        Current items:
        <ul>
          <Scrubber
            onScrub={position => {
              this.setState({ currentDuration: position });
            }}
            position={this.state.currentDuration}
            duration={this.state.totalDuration}
          />
          {this.getActiveItems().map(item => (
            <li key={item.id}>
              {item.id} ({item.time[0]} - {item.time[1]})
              <Sound
                key={item.id}
                url={item.url}
                loop={false}
                onLoad={() => {
                  this.setState({ loaded: true, status: Sound.status.PLAYING });
                }}
                onPlaying={this.onPlaying(item.time[0])}
                playStatus={this.state.status}
                position={this.state.currentDuration - item.time[0]}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default IIIFAvProvider;
