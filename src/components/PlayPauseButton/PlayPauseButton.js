import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TransportBarButton from '../TransportBarButton/TransportBarButton';

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
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      width="45"
      height="45"
      viewBox="0 0 45 45"
      style={{
        enableBackground: 'new 0 0 45 45;',
      }}
      xmlSpace="preserve"
    >
      {props.isPlaying ? (
        <path
          d="M20.6,30.9h-2.9V14.1h2.9V30.9z M27.9,14.1H25v16.9h2.9V14.1z M41.2,22.5c0,10.4-8.4,18.8-18.8,18.8S3.8,32.9,3.8,22.5
  S12.1,3.8,22.5,3.8S41.2,12.1,41.2,22.5z M37.5,22.5c0-8.3-6.7-15-15-15s-15,6.7-15,15s6.7,15,15,15S37.5,30.8,37.5,22.5z"
          style={{
            fill: 'rgb(0, 0, 0)',
          }}
        />
      ) : (
        <path
          d="M18.8,30.9L30,22.5l-11.2-8.4V30.9z M22.5,3.8c-10.4,0-18.8,8.4-18.8,18.8s8.4,18.8,18.8,18.8s18.8-8.4,18.8-18.8
    S32.9,3.8,22.5,3.8z M22.5,37.5c-8.3,0-15-6.7-15-15s6.7-15,15-15s15,6.7,15,15S30.8,37.5,22.5,37.5z"
          style={{
            fill: 'rgb(0, 0, 0)',
          }}
        />
      )}
    </svg>
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
