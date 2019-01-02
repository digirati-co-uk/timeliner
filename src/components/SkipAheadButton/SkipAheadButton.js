import React from 'react';
import PropTypes from 'prop-types';
import TransportBarButton from '../TransportBarButton/TransportBarButton';
import FastForward from '@material-ui/icons/FastForward';

const SkipAheadButton = props => (
  <TransportBarButton title="Skip forwards" {...props}>
    <FastForward />
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
