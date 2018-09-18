import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './SingleBubble.scss';

class SingleBubble extends Component {
  static propTypes = {
    /** Width of the bubble */
    width: PropTypes.number.isRequired,
    /** Height of the bubble */
    height: PropTypes.number.isRequired,
    /** Position on X co-ordinate */
    x: PropTypes.number,
    /** Background colour of the bubble */
    colour: PropTypes.string,
    /** Active colour */
    activeColour: PropTypes.string,
    /** Bubble label text colour */
    labelColour: PropTypes.string,
    /** Click handler for the bubble */
    onClick: PropTypes.func,
    /** Label for the bubble */
    label: PropTypes.string,
  };

  static defaultProps = {
    colour: '#000',
    activeColour: '#555',
    onClick: () => {},
    x: 0,
    y: 0,
    labelColour: '#000',
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
      colour,
      label,
      labelColour,
    } = this.props;
    const d = `M${x},0a${width / 2},${height} 0 0,0 ${width},0`;
    return (
      <g
        onClick={this.onBubbleClick}
        style={{
          cursor: onClick ? 'pointer' : 'none',
        }}
      >
        <path d={d} fill={colour} />
        <text
          textAnchor="middle"
          fill={labelColour}
          stroke="#fff"
          strokeWidth="1.9"
          strokeLinecap="butt"
          strokeLinejoin="miter"
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
