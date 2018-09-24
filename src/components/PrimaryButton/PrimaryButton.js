import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

class PrimaryButton extends Component {
  static propTypes = {
    /** Content of the button */
    children: PropTypes.node.isRequired,
    /** On click */
    onClick: PropTypes.func,
    /** style */
    style: PropTypes.object,
  };

  static defaultProps = {
    style: {},
  };

  render() {
    const { children, onClick, style } = this.props;
    return (
      <Button
        variant="contained"
        color="primary"
        onClick={onClick}
        style={style}
      >
        {children}
      </Button>
    );
  }
}

export default PrimaryButton;
