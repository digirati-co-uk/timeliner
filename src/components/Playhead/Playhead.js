import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Playhead.scss';

class Playhead extends Component {
  static propTypes = {
    /** percentage position of the playhead */
    x: PropTypes.number.isRequired,
  };

  render() {
    const { x } = this.props;
    return (
      <div
        className="playhead"
        style={{
          left: `${x}%`,
        }}
      />
    );
  }
}

export default Playhead;
