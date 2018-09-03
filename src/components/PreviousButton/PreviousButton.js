import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TransportBarButton from '../TransportBarButton/TransportBarButton';

const PreviousButton = props => (
  <TransportBarButton title="Previous Bubble" {...props}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.2"
      overflow="visible"
      preserveAspectRatio="none"
      viewBox="0 0 24 24"
      width="32"
      height="32"
    >
      <g>
        <path
          d="m6 6h2v12h-2zm3.5 6 8.5 6v-12z"
          style={{
            fill: 'rgb(0, 0, 0)',
          }}
          vectorEffect="non-scaling-stroke"
        />
      </g>
    </svg>
  </TransportBarButton>
);

PreviousButton.propTypes = {
  /** Disabled state of button */
  disabled: PropTypes.bool,
  /** Handler for when button is clicked */
  onClick: PropTypes.func.isRequired,
};

PreviousButton.defaultProps = {
  disabled: false,
};

export default PreviousButton;
