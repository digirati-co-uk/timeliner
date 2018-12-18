import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BUBBLE_STYLES } from '../../constants/project';
import './SingleBubble.scss';

const textWidthCache = {};

const getLabelLengthInPixel = label => {
  if (!textWidthCache.hasOwnProperty(label)) {
    const textWidthMeasureEl = document.createElement('span');
    document.body.appendChild(textWidthMeasureEl);
    textWidthMeasureEl.textContent = label;
    textWidthCache[label] = textWidthMeasureEl.offsetWidth;
    document.body.removeChild(textWidthMeasureEl);
  }
  return textWidthCache[label];
};

const getAlteredLabel = (label, width) => {
  let text = label || '';
  if (width === 0) {
    return '';
  }
  const textWidthMeasureEl = document.createElement('span');
  document.body.appendChild(textWidthMeasureEl);
  do {
    textWidthMeasureEl.textContent = text + '...';
    text = text.slice(0, -1);
  } while (
    textWidthMeasureEl.offsetWidth > width &&
    textWidthMeasureEl.textContent !== '...'
  );
  document.body.removeChild(textWidthMeasureEl);
  return textWidthMeasureEl.textContent;
};

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
    /** is bubble selected */
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
      width,
      dX,
      colour,
      label,
      labelColour,
      shape,
      isSelected,
    } = this.props;
    const x = this.props.x || 0;
    const cDX = dX || width / 2 - width / 8;

    const d =
      shape === BUBBLE_STYLES.ROUNDED
        ? `M${x},0C${x},${height} ${x + cDX},${height} ${width / 2 +
            x},${height} C${x + width - cDX},${height} ${width +
            x},${height} ${width + x},${0}`
        : `M${x},0L ${x + 2} ${height}  L${x + width - 2} ${height} L${x +
            width} 0Z`;

    const textWidth = getLabelLengthInPixel(label);
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
          title={label}
        />
        <text
          textAnchor="middle"
          fill={labelColour}
          paintOrder="stroke"
          x={width / 2 + x || 0}
          y={0}
          transform={`scale(1,-1) translate(0,${70 / 2 - height})`}
        >
          {textWidth < width ? label : getAlteredLabel(label, width)}
        </text>
      </g>
    );
  }
}

export default SingleBubble;
