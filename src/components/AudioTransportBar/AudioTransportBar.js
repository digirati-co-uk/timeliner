import React, { Component } from 'react';
import PropTypes from 'prop-types';

class AudioTransportBar extends Component {
  static propTypes = {
    currentPlaybackState: PropTypes.number.isRequired,
    onPlayClicked: PropTypes.func.isRequired,
    onPauseClicked: PropTypes.func.isRequired,
    onNextBubbleClicked: PropTypes.func.isRequired,
    onPreviousBubbleClicked: PropTypes.func.isRequired,
    onScrubAheadClicked: PropTypes.func.isRequired,
    onPreviousBubbleClicked: PropTypes.func.isRequired,
  };
  render() {
    return <div>AudioTransportBar</div>;
  }
}
