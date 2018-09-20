import React, { Component } from 'react';
import { connect } from 'react-redux';
import Audio from './Audio';

class AudioDemo extends Component {
  render() {
    const { loadingPercent, currentTime, runTime } = this.props;
    return (
      <div>
        <Audio />
        <br />
        Loaded {loadingPercent}% - {currentTime} / {runTime}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loadingPercent: state.canvas.loadingPercent,
  currentTime: state.canvas.currentTime,
  runTime: state.canvas.runTime,
});

export default connect(mapStateToProps)(AudioDemo);
