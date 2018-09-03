import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './BubbleDisplay.scss';

class BubbleDisplay extends Component {
  static propTypes = {
    /** Map of points @todo custom validator */
    points: PropTypes.object.isRequired,
    /** Width to display bubble UI */
    width: PropTypes.number.isRequired,
    /** Height to display bubble UI */
    height: PropTypes.number.isRequired,
    /** Current zoom */
    zoom: PropTypes.number,
    /** X offset of view box */
    x: PropTypes.number,
  };

  static defaultProps = {
    zoom: 1,
    x: 0,
    renderBubble: null,
  };

  render() {
    return <div />;
  }
}

export default BubbleDisplay;
