import React, { Component } from 'react';
import PropTypes from 'prop-types';

class TransportBarButton extends Component {
  static propTypes = {
    iconCls: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
  };
  render() {
    return (
      <button
        className={iconCls}
        disabled={this.props.disabled}
        title={this.props.title}
      />
    );
  }
}
