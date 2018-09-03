import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TransportBarButton from '../TransportBarButton/TransportBarButton';

const NextButton = props => (
  <TransportBarButton title="Next Bubble" {...props}>
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
          d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"
          style={{
            fill: 'rgb(0, 0, 0)',
          }}
          vectorEffect="non-scaling-stroke"
        />
      </g>
    </svg>
  </TransportBarButton>
);

NextButton.propTypes = {
  /** Disabled state of button */
  disabled: PropTypes.bool,
  /** Handler for when button is clicked */
  onClick: PropTypes.func.isRequired,
};

NextButton.defaultProps = {
  disabled: false,
};

export default NextButton;
