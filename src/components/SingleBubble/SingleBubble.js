import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './SingleBubble.scss';

class SingleBubble extends Component {
  static propTypes = {
    /** Width of the bubble */
    width: PropTypes.number.isRequired,
    /** Height of the bubble */
    height: PropTypes.number.isRequired,
    /** Position on X co-ordinate */
    x: PropTypes.number,
    /** Position on Y co-ordinate */
    y: PropTypes.number,
    /** Background colour of the bubble */
    colour: PropTypes.string,
    /** Active colour */
    activeColour: PropTypes.string,
    /** Click handler for the bubble */
    onClick: PropTypes.func,
  };

  static defaultProps = {
    colour: '#000',
    activeColour: '#555',
    onClick: () => {},
    x: 0,
    y: 0,
  };

  render() {
    return <svg />;
  }
}

export default SingleBubble;
