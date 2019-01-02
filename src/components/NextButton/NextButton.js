import React from 'react';
import PropTypes from 'prop-types';
import TransportBarButton from '../TransportBarButton/TransportBarButton';
import SkipNext from '@material-ui/icons/SkipNext';

const NextButton = props => (
  <TransportBarButton title="Next Bubble" {...props}>
    <SkipNext />
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
