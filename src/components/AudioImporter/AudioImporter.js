import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './AudioImporter.scss';

class AudioImporter extends Component {
  static propTypes = {
    /** Callback for when a manifest is imported, receives manifest object */
    onImport: PropTypes.func.isRequired,
  };

  render() {
    return <div />;
  }
}

export default AudioImporter;
