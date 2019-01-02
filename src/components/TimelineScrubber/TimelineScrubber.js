import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '@material-ui/core/styles';
import formatDate from 'date-fns/format';
import BEM from '@fesk/bem-js';
import TimelineMarker from '../TimelineMarker/TimelineMarker';
import PlayHead from '../Playhead/Playhead';

import './TimelineScrubber.scss';

const $style = BEM.block('timeline-scrubber');

function getPalletXPosition(palletW, clientX, windowW, offset = 15) {
  const halfPalletW = palletW / 2;
  if (clientX - halfPalletW - offset <= 0) {
    return offset;
  }
  if (clientX + halfPalletW + offset >= windowW) {
    return windowW - palletW - offset;
  }
  return clientX - halfPalletW;
}

class TimelineScrubber extends Component {
  static propTypes = {
    /** Current time of the audio in milliseconds */
    currentTime: PropTypes.number.isRequired,
    /** Total time of the audio in milliseconds */
    runTime: PropTypes.number.isRequired,
    /** the current zoom level */
    zoom: PropTypes.number.isRequired,
    /** Time points */
    timePoints: PropTypes.arrayOf(PropTypes.number),
    /** Handler for when the currentTime is updated */
    onUpdateTime: PropTypes.func,
    /** Handler for when point position is updated */
    onUpdatePoint: PropTypes.func,
    /** Handler for when time point position is updated */
    onUpdateTimePoint: PropTypes.func,
    /** on drag start */
    dragStart: PropTypes.func,
    /** show times */
    showTimes: PropTypes.bool,
    /** current viewport position */
    x: PropTypes.number,
    /** playhead is dragging */
    isPlayheadUpdating: PropTypes.bool,
    /** playhead Drag X */
    playheadX: PropTypes.number,
    /** Current marker and its movement */
    markerMovement: PropTypes.shape({
      selectedPoint: PropTypes.number,
      deltaTime: PropTypes.number,
    }),
  };

  static defaultProps = {
    onUpdateTime: () => {},
    onUpdatePoint: null, // This changes behaviour depending if null.
    onUpdateTimePoint: null, // This changes behaviour depending if null.
    timePoints: [],
    zoom: 1.0,
    showTimes: false,
    isPlayheadUpdating: false,
    playheadX: 0,
  };

  state = { isHovering: false, hoverTime: 0 };

  container = React.createRef();

  tooltip = React.createRef();

  timeToPercent = time => (time / this.props.runTime) * 100;

  resolveTime = (time, markerIndex) => {
    const { markerMovement } = this.props;
    if (markerMovement && markerMovement.selectedPoint === markerIndex) {
      return time + markerMovement.deltaTime;
    }
    return time;
  };

  timeToLabel = time => {
    if (time > this.props.runTime) {
      return this.timeToLabel(this.props.runTime);
    }
    if (time <= 0) {
      return this.timeToLabel(0);
    }
    const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;
    const date = new Date(time + timezoneOffset);
    if (date.toString() === 'Invalid Date') {
      return 'Invalid time';
    }

    const format = time >= 3600000 ? 'hh:mm:ss.S' : 'mm:ss.S';
    return formatDate(date, format);
  };

  handleAddPoint = () => {
    this.props.onClickPoint(this.state.hoverTime);
  };

  dragStart = element => e => this.props.dragStart(element, e);

  onMouseEnter = () => this.setState({ isHovering: true });

  onMouseLeave = () => this.setState({ isHovering: false });

  onMouseMove = e => {
    const bounds = this.container.getBoundingClientRect();
    const positionRatio = (e.pageX - bounds.left) / bounds.width;
    this.setState({
      hoverTime: this.timeToLabel(positionRatio * this.props.runTime),
    });

    const pos = getPalletXPosition(80, e.clientX, bounds.width, 5);
    this.tooltip.style.left = `${pos}px`;
  };

  render() {
    const {
      currentTime,
      timePoints,
      x,
      width,
      zoom,
      isPlayheadUpdating,
      playheadX,
    } = this.props;
    const { isHovering, hoverTime } = this.state;

    return (
      <div
        ref={ref => (this.container = ref)}
        className={$style}
        onDoubleClick={this.handleAddPoint}
        tabIndex={0}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onMouseMove={this.onMouseMove}
        onMouseDown={this.dragStart({ type: 'scrubber' })}
        style={{
          position: 'relative',
          marginLeft: -x,
          width: width * zoom,
        }}
      >
        {timePoints.map((timePoint, timePointIndex) => (
          <TimelineMarker
            index={timePointIndex}
            key={`tp-${timePointIndex}`}
            x={this.timeToPercent(this.resolveTime(timePoint, timePointIndex))}
            onMouseDown={this.dragStart}
          />
        ))}
        <PlayHead
          x={this.timeToPercent(isPlayheadUpdating ? playheadX : currentTime)}
          isUpdating={isPlayheadUpdating}
        />
        <div
          className={$style.element('tooltip')}
          ref={ref => (this.tooltip = ref)}
          style={{ opacity: isHovering ? 1 : 0 }}
        >
          {hoverTime}
        </div>
      </div>
    );
  }
}

export default withTheme()(TimelineScrubber);
