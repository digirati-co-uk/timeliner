import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './TransportBarButton.scss';

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
      <button
        className="transport-bar-button"
        disabled={this.props.disabled}
        title={this.props.title}
        onClick={this.props.disabled ? () => {} : this.props.onClick}
      >
        {this.props.children}
      </button>
    );
  }
}

export default TransportBarButton;
