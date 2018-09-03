import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ColourSwatchPicker.scss';

class ColourSwatchPicker extends Component {
  static propTypes = {
    /** Array of colours to display as choices */
    swatch: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    /** Current colour as chosen by user */
    currentColour: PropTypes.string,
    /** Handler for when a colour is selected */
    onSelectColour: PropTypes.func,
  };

  static defaultProps = {
    currentColour: null,
    onSelectColour: () => {},
  };

  render() {
    return <div />;
  }
}

export default ColourSwatchPicker;
