import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { VolumeSlider } from '../VolumeSlider/VolumeSlider';
import { TransportBarButton } from '../TransportBarButton/TransportBarButton';
import { CurrentTimeIndicator } from '../CurrentTimeIndicator/CurrentTimeIndicator';
import './AudioTransportBar.scss';

export class AudioTransportBar extends Component {
  static propTypes = {
    playbackState: PropTypes.number.isRequired,
    onPlayClicked: PropTypes.func.isRequired,
    onPauseClicked: PropTypes.func.isRequired,
    onNextBubbleClicked: PropTypes.func.isRequired,
    onPreviousBubbleClicked: PropTypes.func.isRequired,
    onScrubAheadClicked: PropTypes.func.isRequired,
    onScrubBackwardsClicked: PropTypes.func.isRequired,
  };

  render() {
    return (
      <div className="audio-transport-bar">
        <CurrentTimeIndicator />
        <div className="audio-transport-bar__buttons">
          <TransportBarButton
            onClick={this.props.onPreviousBubbleClicked}
            iconCls="fas fa-caret-left"
          />
          <TransportBarButton
            onClick={this.props.onScrubBackwardsClicked}
            iconCls="fas fa-angle-double-left"
          />
          <TransportBarButton
            iconCls={
              this.props.playbackState === 1 ? 'fas fa-pause' : 'fas fa-play'
            }
            onClick={
              this.props.playbackState === 1
                ? this.props.onPlayClicked
                : this.props.onPauseClicked
            }
          />
          <TransportBarButton
            onClick={this.props.onScrubAheadClicked}
            iconCls="fas fa-angle-double-right"
          />
          <TransportBarButton
            onClick={this.props.onNextBubbleClicked}
            iconCls="fas fa-caret-right"
          />
        </div>
        <VolumeSlider />
      </div>
    );
  }
}
