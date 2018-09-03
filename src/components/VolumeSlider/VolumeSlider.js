import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class VolumeSlider extends Component {
  static propTypes = {
    volume: PropTypes.number.isRequired,
    onVolumeChanged: PropTypes.func.isRequired,
  };
  render() {
    return <div>VolumeSlider</div>;
  }
}
