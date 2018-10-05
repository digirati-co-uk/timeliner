import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './BubbleDisplay.scss';

class BubbleDisplay extends Component {
  static propTypes = {
    /** Map of points @todo custom validator */
    points: PropTypes.object.isRequired,
    /** Width to display bubble UI */
    width: PropTypes.number.isRequired,
    /** Height to display bubble UI */
    height: PropTypes.number.isRequired,
    /** Current zoom */
    zoom: PropTypes.number,
    /** X offset of view box */
    x: PropTypes.number,
    /** Bubble style passed to single bubbles */
    shape: PropTypes.string,
    /** Bubble height */
    bubbleHeight: PropTypes.number,
    /** on pan start trigger */
    onPanStart: PropTypes.func,
  };

  static defaultProps = {
    zoom: 1,
    x: 0,
    bubbleHeight: 70,
    onPanStart: () => {},
  };

  shouldComponentUpdate(nextProps) {
    const { width, height, zoom, x, points } = this.props;
    const { nextWidth, nextHeight, nextZoom, nextX, nextPoints } = nextProps;
    return (
      width !== nextWidth ||
      height !== nextHeight ||
      zoom !== nextZoom ||
      x !== nextX ||
      JSON.stringify(points) !== JSON.stringify(nextPoints)
    );
  }

  render() {
    const {
      width,
      height,
      zoom,
      x,
      points,
      children,
      shape,
      bubbleHeight,
    } = this.props;
    const realWidth = width * zoom;
    const computedWidth = Math.max(width, 1);
    const maxWidth = Math.max.apply(
      null,
      Object.values(points).map(point => point.endTime)
    );
    const projectionFactor = realWidth / maxWidth;
    const viewBox = [x, 0, computedWidth, height].join(' ');
    const bubbles = Object.values(points).map(point => ({
      x: point.startTime * projectionFactor,
      width: (point.endTime - point.startTime) * projectionFactor,
      colour: point.colour,
      height: point.depth * bubbleHeight, //Math.pow(2 / 3, point.depth - 1) * height,
      label: point.label,
      point,
      isSelected: point.isSelected,
      shape,
    }));

    const childrenWithProps =
      typeof children === 'function'
        ? children(bubbles)
        : React.Children.map(children, child =>
            React.cloneElement(child, { points: bubbles })
          );

    return (
      <svg
        width={computedWidth}
        height={height}
        viewBox={viewBox}
        className="bubble-display"
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
      >
        <g
          key="bubble_display_main"
          transform={`translate(0,${height}) scale(1, -1)`}
        >
          <rect
            width={computedWidth * zoom}
            height={height}
            style={{
              fill: '#ffffff',
              strokeWidth: 0,
              stroke: 'rgb(0,0,0,0)',
              cursor: 'grab',
            }}
            onMouseDown={this.props.onPanStart}
          />
          {childrenWithProps}
        </g>
      </svg>
    );
  }
}

export default BubbleDisplay;
