import React from 'react';
import PropTypes from 'prop-types';
import TransportBarButton from '../TransportBarButton/TransportBarButton';
import FastRewind from '@material-ui/icons/FastRewind';

const SkipBackwardsButton = props => (
  <TransportBarButton title="Skip backwards" {...props}>
    <FastRewind />
  </TransportBarButton>
);

SkipBackwardsButton.propTypes = {
  /** Disabled state of button */
  disabled: PropTypes.bool,
  /** Handler for when button is clicked */
  onClick: PropTypes.func.isRequired,
};

SkipBackwardsButton.defaultProps = {
  disabled: false,
};

export default SkipBackwardsButton;
