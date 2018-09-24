import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '@material-ui/core/styles';

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
    /** Map of points @todo custom validator */
    points: PropTypes.object.isRequired,
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
  };

  static defaultProps = {
    onClickPoint: () => {},
    onUpdateTime: () => {},
    onUpdatePoint: null, // This changes behaviour depending if null.
    onUpdateTimePoint: null, // This changes behaviour depending if null.
    timePoints: [],
    renderTimelineHover: () => null,
    zoom: 1.0,
  };

  timeToPercent = time => (time / this.props.runTime) * 100 * this.props.zoom;

  render() {
    const { currentTime, timePoints, theme } = this.props;
    return (
      <div className="timeline-scrubber">
        {timePoints.map(timePoint => (
          <TimelineMarker
            key={`tp-${timePoint}`}
            x={this.timeToPercent(timePoint)}
            isUpdating={false}
          />
        ))}
        <PlayHead x={this.timeToPercent(currentTime)} isUpdating={false} />
      </div>
    );
  }
}

export default withTheme()(TimelineScrubber);
