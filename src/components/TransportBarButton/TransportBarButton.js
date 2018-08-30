import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './TransportBarButton.scss';

export class TransportBarButton extends Component {
  static propTypes = {
    iconCls: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
  };
  render() {
    return (
      <button
        className="transport-bar-button"
        disabled={this.props.disabled}
        title={this.props.title}
        onClick={this.props.onClick}
      >
        <i className={this.props.iconCls} />
      </button>
    );
  }
}
