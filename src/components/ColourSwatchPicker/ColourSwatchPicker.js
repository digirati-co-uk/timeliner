import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SketchPicker } from 'react-color';
import { Button } from '@material-ui/core';
import { KeyboardArrowDown } from '@material-ui/icons';
import './ColourSwatchPicker.scss';

const hexToRgb = hex =>
  hex
    .replace(
      /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
      (m, r, g, b) => '#' + r + r + g + g + b + b
    )
    .substring(1)
    .match(/.{2}/g)
    .map(x => parseInt(x, 16));

const rgbToOrgba = rgb =>
  rgb.reduce(
    (rgba, component, idx) => {
      rgba[Object.keys(rgba)[idx]] = component;
      return rgba;
    },
    {
      r: 255,
      g: 255,
      b: 255,
      a: 1,
    }
  );

const orgbToHex = orgb => {
  const r = parseInt(orgb.r, 10)
    .toString(16)
    .padStart(2, '0');
  const g = parseInt(orgb.g, 10)
    .toString(16)
    .padStart(2, '0');
  const b = parseInt(orgb.b, 10)
    .toString(16)
    .padStart(2, '0');
  return `#${r}${g}${b}`;
};

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
    swatch: [
      '#B80000',
      '#DB3E00',
      '#FCCB00',
      '#008B02',
      '#006B76',
      '#1273DE',
      '#004DCF',
      '#5300EB',
      '#EB9694',
      '#FAD0C3',
      '#FEF3BD',
      '#C1E1C5',
      '#BEDADC',
      '#C4DEF6',
      '#BED3F3',
      '#D4C4FB',
    ],
    onSelectColour: () => {},
  };

  state = {
    colour: {
      r: '241',
      g: '112',
      b: '19',
      a: '1',
    },
    displayColourPicker: false,
  };

  handleClick = () => {
    this.setState({ displayColourPicker: !this.state.displayColourPicker });
  };

  handleClose = () => {
    this.setState({ displayColourPicker: false });
  };

  handleChange = colour => {
    this.setState({ colour: colour });
    this.props.onSelectColour(colour.hex);
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.currentColour &&
      nextProps.currentColour.startsWith('#') &&
      nextProps.currentColour !== orgbToHex(prevState.colour)
    ) {
      return {
        colour: rgbToOrgba(hexToRgb(nextProps.currentColour)),
      };
    }
  }

  render() {
    const { colour, displayColourPicker, swatch } = this.state;

    const popover = {
      position: 'absolute',
      zIndex: '2',
      transform: 'translate(0,-100%)',
      paddingBottom: '50px',
    };
    const cover = {
      position: 'fixed',
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px',
    };
    return (
      <div>
        <Button
          variant="outlined"
          size="small"
          color="primary"
          onClick={this.handleClick}
        >
          <div
            className="colour-swatch-picker__option"
            style={{
              backgroundColor: orgbToHex(colour),
            }}
          />
          <KeyboardArrowDown />
        </Button>
        {displayColourPicker ? (
          <div style={popover}>
            <div style={cover} onClick={this.handleClose} />
            <SketchPicker
              disableAlpha={true}
              presetColors={swatch}
              color={colour}
              onChange={this.handleChange}
            />
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default ColourSwatchPicker;
