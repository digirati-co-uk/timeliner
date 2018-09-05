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
  static defaultProps = {
    volume: 100,
  };
  static instances = 0;

  constructor(props) {
    super(props);
    this.instanceId = VolumeSlider.instances++;
  }

  onVolumeInputChange = ev => {
    const { onVolumeChanged } = this.props;
    if (onVolumeChanged) {
      onVolumeChanged(parseInt(ev.target.value, 10));
    }
  };

  render() {
    const { volume } = this.props;
    const width = 294;
    const maxVolume = 100;
    const currentVolumeWidth = (volume / maxVolume) * width;
    return (
      <div className="volume-slider">
        <svg
          version="1.0"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          x="0"
          y="0"
          viewBox={`0 0 ${width} 24`}
          style={{
            enableBackground: `new 0 0 ${width} 24`,
          }}
          xmlSpace="preserve"
        >
          <polygon
            className="volume-slider__background"
            points={`0,24 ${width},0 ${width},24`}
          />
          <g>
            <defs>
              <rect
                id={`CurrentVolumeMask_${this.instanceId}`}
                width={currentVolumeWidth}
                height="24"
              />
            </defs>
            <clipPath id={`CurrentVolumeMask_${this.instanceId}_`}>
              <use
                xlinkHref={`#CurrentVolumeMask_${this.instanceId}`}
                style={{
                  overflow: 'visible',
                }}
              />
            </clipPath>
            <polygon
              className="volume-slider__foreground"
              points={`0,24 ${width},0 ${width},24`}
              clipPath={`url("#CurrentVolumeMask_${this.instanceId}_")`}
            />
          </g>
        </svg>
        <input
          type="range"
          className="volume-slider__range"
          min="0"
          max={maxVolume}
          value={volume}
          onChange={this.onVolumeInputChange}
        />
      </div>
    );
  }
}

export default VolumeSlider;
