import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '@material-ui/core/styles';
import formatDate from 'date-fns/format';

import TimelineMarker from '../TimelineMarker/TimelineMarker';
import PlayHead from '../Playhead/Playhead';

import './TimelineScrubber.scss';

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
    selectedPoint: PropTypes.number,
    /** show times */
    showTimes: PropTypes.bool,
    /** current viewport position */
    x: PropTypes.number,
    /** playhead is dragging */
    isPlayheadUpdating: PropTypes.bool,
    /** playhead Drag X */
    playheadX: PropTypes.number,
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

  timeToPercent = time => (time / this.props.runTime) * 100; //* this.props.zoom;

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
    const scrobberBounds = ev.currentTarget.getBoundingClientRect();
    const positionRatio =
      (ev.pageX - scrobberBounds.left) / scrobberBounds.width;
    return positionRatio * this.props.runTime;
  };

  handleAddPoint = ev => {
    const time = this.getClickedTime(ev);
    this.props.onClickPoint(time);
  };

  render() {
    const {
      currentTime,
      timePoints,
      theme,
      selectedPoint,
      showTimes,
      x,
      width,
      zoom,
      isPlayheadUpdating,
      playheadX,
    } = this.props;
    return (
      <div
        className="timeline-scrubber"
        onDoubleClick={this.handleAddPoint}
        onMouseDown={this.props.dragStart}
        style={{
          position: 'relative',
          marginLeft: -x,
          width: width * zoom,
        }}
      >
        {timePoints.map((timePoint, timePointIndex) => (
          <TimelineMarker
            key={`tp-${timePointIndex}`}
            x={this.timeToPercent(timePoint)}
          >
            {timePoint === timePoints[selectedPoint] || showTimes ? (
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
                {this.timeToLabel(timePoint)}
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
