import React, { Component } from 'react';
import BEM from '@fesk/bem-js';
import './VolumeSliderCompact.scss';
import PropTypes from 'prop-types';
import VolumeUp from '@material-ui/icons/VolumeUp';
import VolumeDown from '@material-ui/icons/VolumeDown';
import VolumeOff from '@material-ui/icons/VolumeOff';
import Slider from '@material-ui/lab/Slider';

const $style = BEM.block('volume-slider-compact');

const SPEAKER_ICON_SIZE = {
  width: 20,
  height: 20,
};

class VolumeSliderCompact extends Component {
  state = { previousVolume: null };

  static propTypes = {
    /** Current volume value */
    volume: PropTypes.number.isRequired,
    /** Handler for when volume is changed */
    onVolumeChanged: PropTypes.func.isRequired,
    /** Flip the order of the slider and icon */
    flipped: PropTypes.bool,
  };

  static defaultProps = {
    volume: 100,
    flipped: false,
  };

  onVolumeInputChange = (ev, value) => {
    const { onVolumeChanged } = this.props;
    if (onVolumeChanged) {
      onVolumeChanged(parseInt(value, 10));
    }
  };

  onToggle = () => {
    const { volume, onVolumeChanged } = this.props;
    const { previousVolume } = this.state;
    if (onVolumeChanged) {
      if (volume === 0) {
        onVolumeChanged(previousVolume || 100);
      } else {
        this.setState({ previousVolume: volume });
        onVolumeChanged(0);
      }
    }
  };

  render() {
    const { volume, flipped } = this.props;

    return (
      <div className={$style.modifiers({ flipped })}>
        <Slider
          min={0}
          max={100}
          value={volume}
          onChange={this.onVolumeInputChange}
        />
        <div className={$style.element('muter')} onClick={this.onToggle}>
          {volume === 0 ? (
            <VolumeOff
              style={{ ...SPEAKER_ICON_SIZE, transform: 'translateX(1px)' }}
            />
          ) : volume <= 40 ? (
            <VolumeDown
              style={{ ...SPEAKER_ICON_SIZE, transform: 'translateX(-0.5px)' }}
            />
          ) : (
            <VolumeUp
              style={{ ...SPEAKER_ICON_SIZE, transform: 'translateX(1px)' }}
            />
          )}
        </div>
      </div>
    );
  }
}

export default VolumeSliderCompact;
