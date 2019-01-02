import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Slider from '@material-ui/lab/Slider';
import VolumeDown from '@material-ui/icons/VolumeDown';
import VolumeUp from '@material-ui/icons/VolumeUp';
import './VolumeSlider.scss';

const SPEAKER_ICON_SIZE = {
  width: 20,
  height: 20,
};

class VolumeSlider extends Component {
  static propTypes = {
    /** Current volume value */
    volume: PropTypes.number.isRequired,
    /** Handler for when volume is changed */
    onVolumeChanged: PropTypes.func.isRequired,
  };
  static defaultProps = {
    volume: 100,
  };

  onVolumeInputChange = (ev, value) => {
    const { onVolumeChanged } = this.props;
    if (onVolumeChanged) {
      onVolumeChanged(parseInt(value, 10));
    }
  };

  render() {
    const { volume } = this.props;
    return (
      <div className="volume-slider">
        <VolumeDown color="disabled" style={SPEAKER_ICON_SIZE} />
        <Slider
          min={0}
          max={100}
          value={volume}
          onChange={this.onVolumeInputChange}
        />
        <VolumeUp color="disabled" style={SPEAKER_ICON_SIZE} />
      </div>
    );
  }
}

export default VolumeSlider;
