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
    /** Function that returns a mouse down event handler */
    onMouseDown: PropTypes.func,
  };

  static defaultProps = {
    x: 0,
  };

  render() {
    const { x, index, onMouseDown, children } = this.props;
    return (
      <div
        className={$style}
        style={{
          left: `${x}%`,
        }}
        onMouseDown={
          onMouseDown ? onMouseDown({ type: 'marker', x, index }) : null
        }
      >
        {children}
      </div>
    );
  }
}

export default TimelineMarker;
