import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TransportBarButton from '../TransportBarButton/TransportBarButton';

const SkipAheadButton = props => (
  <TransportBarButton title="Skip forwards" {...props}>
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
          d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"
          style={{
            fill: 'rgb(0, 0, 0)',
          }}
          vectorEffect="non-scaling-stroke"
        />
      </g>
    </svg>
  </TransportBarButton>
);

SkipAheadButton.propTypes = {
  /** Disabled state of button */
  disabled: PropTypes.bool,
  /** Handler for when button is clicked */
  onClick: PropTypes.func.isRequired,
};

SkipAheadButton.defaultProps = {
  disabled: false,
};

export default SkipAheadButton;
