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
  };

  timeToPercent = time => (time / this.props.runTime) * 100 * this.props.zoom;

  timeToLabel = time => {
    const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;
    const date = new Date(time + timezoneOffset);
    if (date.toString() === 'Invalid Date') {
      return 'Invalid time';
    }

    const format = time >= 3600000 ? 'hh:mm:ss' : 'mm:ss';
    return formatDate(date, format);
  };

  getClickedTime = ev => {
    const scrobberBounds = ev.currentTarget.getBoundingClientRect();
    const positionRatio =
      (ev.pageX - scrobberBounds.left) /
      (scrobberBounds.width * this.props.zoom);
    return positionRatio * this.props.runTime;
  };

  handleJumpToTime = ev => {
    const time = this.getClickedTime(ev);
    this.props.onUpdateTime(time);
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
    } = this.props;
    return (
      <div
        className="timeline-scrubber"
        onClick={this.handleJumpToTime}
        onDoubleClick={this.handleAddPoint}
        onMouseDown={this.props.dragStart}
      >
        {timePoints.map(timePoint => (
          <TimelineMarker
            key={`tp-${timePoint}`}
            x={this.timeToPercent(timePoint)}
          >
            {timePoint === timePoints[selectedPoint] || showTimes ? (
              <span className="timeline-marker__tooltip">
                {this.timeToLabel(timePoint)}
              </span>
            ) : (
              ''
            )}
          </TimelineMarker>
        ))}
        <PlayHead x={this.timeToPercent(currentTime)} isUpdating={false} />
      </div>
    );
  }
}

export default withTheme()(TimelineScrubber);
