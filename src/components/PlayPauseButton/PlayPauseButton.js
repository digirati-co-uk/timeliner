import React from 'react';
import PropTypes from 'prop-types';
import PlayCircleOutline from '@material-ui/icons/PlayCircleOutline';
import PauseCircleOutline from '@material-ui/icons/PauseCircleOutline';
import TransportBarButton from '../TransportBarButton/TransportBarButton';

const PLAY_PAUSE_BUTTON_SIZE = {
  width: 48,
  height: 48,
};

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
    style={{
      border: '2px solid black',
    }}
    disabled={props.disabled}
  >
    {props.isPlaying ? (
      <PauseCircleOutline style={PLAY_PAUSE_BUTTON_SIZE} />
    ) : (
      <PlayCircleOutline style={PLAY_PAUSE_BUTTON_SIZE} />
    )}
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
