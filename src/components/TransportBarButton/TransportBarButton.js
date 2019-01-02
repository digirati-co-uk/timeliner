import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';

class TransportBarButton extends Component {
  static propTypes = {
    /** Title of button, for accessibility */
    title: PropTypes.string.isRequired,
    /** Disabled state of button */
    disabled: PropTypes.bool,
    /** Handler for when button is clicked */
    onClick: PropTypes.func.isRequired,
  };

  static defaultProps = {
    disabled: false,
  };

  render() {
    return (
      <IconButton
        color="primary"
        disabled={this.props.disabled}
        title={this.props.title}
        onClick={this.props.disabled ? () => {} : this.props.onClick}
      >
        {this.props.children}
      </IconButton>
    );
  }
}

export default TransportBarButton;
