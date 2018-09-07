import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TransportBarButton from '../TransportBarButton/TransportBarButton';
import { PlayCircleFilled, PauseCircleFilled } from '@material-ui/icons';

const PlayPauseButton = props => (
  <TransportBarButton
    title={props.isPlaying ? 'Pause' : 'Play'}
    onClick={() => {
      if (props.isPlaying) {
        props.onPause();
      } else {
        props.onPlay();
      }
    }}
    disabled={props.disabled}
  >
    {props.isPlaying ? <PauseCircleFilled /> : <PlayCircleFilled />}
  </TransportBarButton>
);

PlayPauseButton.propTypes = {
  /** Disabled state of button */
  disabled: PropTypes.bool,
  /** Handler for when play button is clicked */
  onPlay: PropTypes.func.isRequired,
  /** Handler for when pause button is clicked */
  onPause: PropTypes.func.isRequired,
  /** Is playing? */
  isPlaying: PropTypes.bool,
};

PlayPauseButton.defaultProps = {
  disabled: false,
  isPlaying: false,
};

export default PlayPauseButton;
