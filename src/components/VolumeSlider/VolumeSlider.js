import React, { Component } from 'react';
import PropTypes from 'prop-types';

class VolumeSlider extends Component {
  static propTypes = {
    volume: PropTypes.number.isRequired,
    onVolumeChanged: PropTypes.func.isRequired,
  };
  render() {
    return <div>VolumeSlider</div>;
  }
}
