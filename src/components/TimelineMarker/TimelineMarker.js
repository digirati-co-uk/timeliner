import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '@material-ui/core/styles';
import './TimelineMarker.scss';

class TimelineMarker extends Component {
  static propTypes = {
    /** percentage position for the marker */
    x: PropTypes.number.isRequired,
  };

  render() {
    const { x, theme } = this.props;
    return (
      <div
        className="timeline-marker"
        style={{
          left: `${x}%`,
          background: `${theme.palette.primary.main}`,
        }}
      />
    );
  }
}

export default withTheme()(TimelineMarker);
