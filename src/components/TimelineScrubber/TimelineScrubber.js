import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '@material-ui/core/styles';
import formatDate from 'date-fns/format';
import BEM from '@fesk/bem-js';
import TimelineMarker from '../TimelineMarker/TimelineMarker';
import PlayHead from '../Playhead/Playhead';

import './TimelineScrubber.scss';

const $style = BEM.block('timeline-scrubber');

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
    /** Handler for when a point is clicked on the timeline */
    onClickPoint: PropTypes.func,
    /** Handler for when the currentTime is updated */
    onUpdateTime: PropTypes.func,
    /** Handler for when point position is updated */
    onUpdatePoint: PropTypes.func,
    /** Handler for when time point position is updated */
    onUpdateTimePoint: PropTypes.func,
    /** Component to render above mouse when hovering */
    renderTimelineHover: PropTypes.func,
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
    onClickPoint: () => {},
    onUpdateTime: () => {},
    onUpdatePoint: null, // This changes behaviour depending if null.
    onUpdateTimePoint: null, // This changes behaviour depending if null.
    timePoints: [],
    renderTimelineHover: () => null,
    zoom: 1.0,
    dragStart: () => {},
    showTimes: false,
    isPlayheadUpdating: false,
    playheadX: 0,
  };

  timeToPercent = time => (time / this.props.runTime) * 100;

  resolveTime = (time, markerIndex) => {
    const { markerMovement } = this.props;
    if (markerMovement && markerMovement.selectedPoint === markerIndex) {
      return time + markerMovement.deltaTime;
    }
    return time;
  };

  timeToLabel = time => {
    const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;
    const date = new Date(time + timezoneOffset);
    if (date.toString() === 'Invalid Date') {
      return 'Invalid time';
    }

    const format = time >= 3600000 ? 'hh:mm:ss.S' : 'mm:ss.S';
    return formatDate(date, format);
  };

  getClickedTime = ev => {
    const bounds = ev.currentTarget.getBoundingClientRect();
    const positionRatio = (ev.pageX - bounds.left) / bounds.width;
    return positionRatio * this.props.runTime;
  };

  handleAddPoint = ev => {
    const time = this.getClickedTime(ev);
    this.props.onClickPoint(time);
  };

  dragStart = element => e => this.props.dragStart(element, e);

  render() {
    const {
      currentTime,
      timePoints,
      showTimes,
      x,
      width,
      zoom,
      isPlayheadUpdating,
      playheadX,
      markerMovement,
    } = this.props;

    const selectedIndex = markerMovement ? markerMovement.selectedPoint : -1;

    return (
      <div
        className={$style}
        onDoubleClick={this.handleAddPoint}
        tabIndex={0}
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
          >
            {timePointIndex === selectedIndex || showTimes ? (
              <span
                className="timeline-marker__tooltip"
                style={{
                  transform:
                    timePointIndex === 0
                      ? 'translate(0)'
                      : timePointIndex === timePoints.length - 1
                      ? 'translate(-100%)'
                      : 'translate(-50%)',
                }}
              >
                {this.timeToLabel(this.resolveTime(timePoint, timePointIndex))}
              </span>
            ) : (
              ''
            )}
          </TimelineMarker>
        ))}
        <PlayHead
          x={this.timeToPercent(isPlayheadUpdating ? playheadX : currentTime)}
          isUpdating={isPlayheadUpdating}
        />
      </div>
    );
  }
}

export default withTheme()(TimelineScrubber);
