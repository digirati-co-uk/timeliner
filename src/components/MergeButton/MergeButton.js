import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';
import { MergeType } from '@material-ui/icons';

const MergeButton = props => (
  <IconButton
    color="inherit"
    disabled={props.disabled}
    title="Merge Bubbles"
    onClick={props.disabled ? () => {} : props.onClick}
  >
    <MergeType />
  </IconButton>
);

MergeButton.propTypes = {
  /** Handler for when the button is clicked */
  onClick: PropTypes.func.isRequired,
  /** Handler for when the button is clicked */
  disabled: PropTypes.bool.isRequired,
};

MergeButton.defaultProps = {
  disabled: true,
};

export default MergeButton;
