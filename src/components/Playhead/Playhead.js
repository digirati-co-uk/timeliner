import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '@material-ui/core/styles';

import './Playhead.scss';

class Playhead extends Component {
  static propTypes = {
    /** percentage position of the playhead */
    x: PropTypes.number.isRequired,
  };

  render() {
    const { x, theme } = this.props;
    return (
      <div
        className="playhead"
        style={{
          width: `${x}%`,
        }}
      />
    );
  }
}

export default withTheme()(Playhead);
