import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '@material-ui/core/styles';
import './TimelineMarker.scss';

class TimelineMarker extends Component {
  static propTypes = {
    /** percentage position for the marker */
    x: PropTypes.number.isRequired,
  };

  static defaultProps = {
    x: 0,
  };

  render() {
    const { x, theme, children } = this.props;
    return (
      <div
        className="timeline-marker"
        style={{
          left: `${x}%`,
          background: `${theme.palette.primary.main}`,
        }}
      >
        {children}
      </div>
    );
  }
}

export default withTheme()(TimelineMarker);
