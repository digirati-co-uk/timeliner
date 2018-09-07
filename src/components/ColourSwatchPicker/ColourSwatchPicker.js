import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ColourSwatchPicker.scss';

import { Select, MenuItem } from '@material-ui/core';

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

  state = {
    currentColour: null,
  };

  onSelect = (ev, child) => {
    this.setState({
      currentColour: child.props.value,
    });
    this.props.onSelectColour(child.props.value);
  };

  render() {
    const { swatch } = this.props;
    const { currentColour } = this.state;
    return (
      <Select
        displayEmpty={true}
        native={false}
        value={currentColour}
        onChange={this.onSelect}
        renderValue={colourIndex => (
          <div
            className="colour-swatch-picker__option"
            style={{
              backgroundColor: swatch[colourIndex],
            }}
          />
        )}
      >
        {swatch.map((colour, index) => (
          <MenuItem value={index}>
            <div
              selected={currentColour === index}
              className="colour-swatch-picker__option"
              style={{
                backgroundColor: colour,
              }}
            />
          </MenuItem>
        ))}
      </Select>
    );
  }
}

export default ColourSwatchPicker;
