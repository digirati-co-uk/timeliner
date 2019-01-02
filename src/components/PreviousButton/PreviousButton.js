import React from 'react';
import PropTypes from 'prop-types';
import TransportBarButton from '../TransportBarButton/TransportBarButton';
import SkipPrevious from '@material-ui/icons/SkipPrevious';

const PreviousButton = props => (
  <TransportBarButton title="Previous Bubble" {...props}>
    <SkipPrevious />
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
