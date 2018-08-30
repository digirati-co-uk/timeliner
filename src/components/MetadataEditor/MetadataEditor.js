import React, { Component } from 'react';
import PropTypes from 'prop-types';

class MetadataEditor extends Component {
  static propTypes = {
    /** Current label of the manifest or range */
    label: PropTypes.string.isRequired,
    /** Current summary of the manifest or range */
    summary: PropTypes.string.isRequired,
    /** Call back when save button is clicked, gets passed an object with label and summary */
    onSave: PropTypes.func.isRequired,
  };

  render() {
    return <div />;
  }
}

export default MetadataEditor;
