import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './VolumeSlider.scss';

class VolumeSlider extends Component {
  static propTypes = {
    /** Current volume value */
    volume: PropTypes.number.isRequired,
    /** Handler for when volume is changed */
    onVolumeChanged: PropTypes.func.isRequired,
  };
  render() {
    return <div>VolumeSlider</div>;
  }
}

export default VolumeSlider;
