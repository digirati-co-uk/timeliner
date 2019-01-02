import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './TimelineMarker.scss';
import BEM from '@fesk/bem-js';

const $style = BEM.block('timeline-marker');

class TimelineMarker extends Component {
  static propTypes = {
    /** percentage position for the marker */
    x: PropTypes.number.isRequired,
    /** Index of the marker when in a list */
    index: PropTypes.number.isRequired,
  };

  static defaultProps = {
    x: 0,
  };

  onMouseDown = () => {};

  render() {
    const { x, index, children } = this.props;
    return (
      <div
        className={$style}
        style={{
          left: `${x}%`,
        }}
        onMouseDown={this.props.onMouseDown({ type: 'marker', x, index })}
      >
        {children}
      </div>
    );
  }
}

export default TimelineMarker;
