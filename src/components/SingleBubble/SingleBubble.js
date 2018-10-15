import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BUBBLE_STYLES } from '../../constants/project';
import './SingleBubble.scss';

class SingleBubble extends Component {
  static propTypes = {
    /** Width of the bubble */
    width: PropTypes.number.isRequired,
    /** Height of the bubble */
    height: PropTypes.number.isRequired,
    /** Position on X co-ordinate */
    x: PropTypes.number,
    /** curve adjustment */
    dX: PropTypes.number,
    /** Background colour of the bubble */
    colour: PropTypes.string,
    /** Bubble label text colour */
    labelColour: PropTypes.string,
    /** Click handler for the bubble */
    onClick: PropTypes.func,
    /** Label for the bubble */
    label: PropTypes.string,
    /** Bubble style */
    shape: PropTypes.string,
    /** is bubble seleced */
    isSelected: PropTypes.bool,
  };

  static defaultProps = {
    colour: '#000',
    onClick: () => {},
    x: 0,
    y: 0,
    labelColour: '#000',
    shape: BUBBLE_STYLES.ROUNDED,
    isSelected: false,
  };

  onBubbleClick = ev => {
    const { onClick } = this.props;
    if (onClick) {
      onClick(this.props.point, ev);
    }
  };

  render() {
    const {
      onClick,
      height,
      x,
      width,
      dX,
      colour,
      label,
      labelColour,
      shape,
      isSelected,
    } = this.props;
    //`M${x},0a${width / 2},${height} 0 0,0 ${width},0`
    const cDX = dX || width / 2 - width / 8;
    const d =
      shape === BUBBLE_STYLES.ROUNDED
        ? `M${x},0C${x},${height} ${x + cDX},${height} ${width / 2 +
            x},${height} C${x + width - cDX},${height} ${width +
            x},${height} ${width + x},${0}`
        : `M${x},0L ${x + 2} ${height}  L${x + width - 2} ${height} L${x +
            width} 0Z`;
    return (
      <g
        onClick={this.onBubbleClick}
        style={{
          cursor: onClick ? 'pointer' : 'none',
        }}
      >
        <path
          d={d}
          fill={colour}
          strokeWidth={isSelected ? 2 : 0}
          stroke={isSelected ? 'black' : 'transparent'}
        />
        <text
          textAnchor="middle"
          fill={labelColour}
          paintOrder="stroke"
          x={width / 2 + x}
          y={0}
          transform={`scale(1,-1) translate(0,${70 / 2 - height})`}
        >
          {label}
        </text>
      </g>
    );
  }
}

export default SingleBubble;
