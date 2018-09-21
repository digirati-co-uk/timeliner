import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Slider } from '@material-ui/lab';
import { VolumeDown, VolumeUp } from '@material-ui/icons'; 
import './VolumeSlider.scss';

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
    console.log(value);
    const { onVolumeChanged } = this.props;
    if (onVolumeChanged) {
      onVolumeChanged(parseInt(value, 10));
    }
  };

  render() {
    const { volume } = this.props;
    return (
      <div className="volume-slider">
        <VolumeDown color="disabled" fontSize="small" />
        <Slider
          min={0}
          max={100}
          value={volume}
          onChange={this.onVolumeInputChange}
        />
        <VolumeUp color="disabled" fontSize="small" />
      </div>
    );
  }
}

export default VolumeSlider;
