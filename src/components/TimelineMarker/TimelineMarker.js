import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './TimelineMarker.scss';
import BEM from '@fesk/bem-js';

const $style = BEM.block('timeline-marker');

class TimelineMarker extends Component {
  static propTypes = {
    /** percentage position for the marker */
    x: PropTypes.number.isRequired,
    /** Function that returns a mouse down event handler */
    onMouseDown: PropTypes.func,
    /** Is bookmark variation */
    bookmark: PropTypes.bool,
    /** Tooltip is visible */
    showTooltip: PropTypes.bool,
    /** Tooltip css styles */
    tooltipStyle: PropTypes.any,
    /** Tooltip to show */
    tooltip: PropTypes.string,
  };

  static defaultProps = {
    x: 0,
    bookmark: false,
    onMouseDown: null,
    tooltipStyle: {},
  };

  render() {
    const {
      x,
      showTooltip,
      onMouseDown,
      tooltipStyle,
      tooltip,
      bookmark,
    } = this.props;

    return (
      <div
        className={$style.modifiers({ bookmark, marker: !bookmark })}
        style={{ left: `${x}%` }}
        onMouseDown={onMouseDown}
      >
        {showTooltip ? (
          <span className={$style.element('tooltip')} style={tooltipStyle}>
            {tooltip}
          </span>
        ) : null}
      </div>
    );
  }
}

export default TimelineMarker;
