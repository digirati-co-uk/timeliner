import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

const PrimaryButton = props => {
  const { children, ...buttonProps } = props;
  return (
    <Button variant="contained" color="primary" {...buttonProps}>
      {children}
    </Button>
  );
};

PrimaryButton.propTypes = {
  /** Content of the button */
  children: PropTypes.node.isRequired,
};

export default PrimaryButton;
