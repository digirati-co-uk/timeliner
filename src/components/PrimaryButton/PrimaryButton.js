import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

class PrimaryButton extends Component {
  static propTypes = {
    /** Content of the button */
    children: PropTypes.node.isRequired,
    /** On click */
    onClick: PropTypes.func,
  };

  render() {
    const { children, onClick } = this.props;
    return (
      <Button variant="contained" color="primary" onClick={onClick}>
        {children}
      </Button>
    );
  }
}

export default PrimaryButton;
