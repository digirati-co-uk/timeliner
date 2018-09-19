import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './TimelineMarker.scss';

class TimelineMarker extends Component {
  static propTypes = {
    x: PropTypes.number.isRequired,
  };

  render() {
    return (
      <div
        className="timeline-marker"
        style={{
          left: this.props.x,
        }}
      />
    );
  }
}

export default TimelineMarker;
