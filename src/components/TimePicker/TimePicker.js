import React from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '@material-ui/core/styles';
import './TimePicker.scss';

const FIELD_MULTIPLIER = {
  second: 1000,
  minute: 60 * 1000,
  hour: 60 * 60 * 1000,
};

const FIELD_MIN_MAX = {
  second: {
    min: 0,
    max: 60,
  },
  minute: {
    min: 0,
    max: 60,
  },
  hour: {
    min: 0,
    max: 23,
  },
};

const TWENTY_FOUR_HOUR = 24 * 60 * 60 * 1000;

class TimePicker extends React.Component {
  constructor(props) {
    super(props);
  }
  static propTypes = {
    min: PropTypes.number,
    max: PropTypes.number,
    value: PropTypes.number,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    min: 0,
    max: TWENTY_FOUR_HOUR - 1,
    value: 0,
  };

  onChange = value =>
    this.props.onChange && this.props.onChange(this.applyMinMax(value));

  applyMinMax = value =>
    Math.max(this.props.min, Math.min(this.props.max, value));

  increaseDecrease = ev => {
    if (ev.keyCode === 38) {
      ev.stopPropagation();
      ev.preventDefault();
      this.onChange(this.props.value + FIELD_MULTIPLIER[ev.currentTarget.name]);
    } else if (ev.keyCode === 40) {
      ev.stopPropagation();
      ev.preventDefault();
      this.onChange(this.props.value - FIELD_MULTIPLIER[ev.currentTarget.name]);
    }
  };

  internalFieldChange = ev => {
    const field = ev.currentTarget.name;
    let displayValue = ev.currentTarget.value
      .replace(/[^0-9]/, '')
      .substr(-2, 2);
    let parsedValue = parseInt(displayValue, 10) || 0;
    let parsedValueAdjusted = Math.max(
      Math.min(parsedValue, FIELD_MIN_MAX[field].max),
      FIELD_MIN_MAX[field].min
    );

    if (parsedValueAdjusted !== parsedValue) {
      // displayValue = ('' + parsedValueAdjusted).padStart(2, '0');
      parsedValue = parsedValueAdjusted;
    }

    if (this.props.onChange) {
      const timeParts = this.getParts();
      timeParts[field] = parsedValue;
      const newValue = this.computeTime(timeParts);
      this.onChange(newValue);
    }
  };

  getParts = () => {
    const { value, min, max } = this.props;
    const displayValue = Math.max(min, Math.min(value, max));
    const hour = Math.floor(displayValue / FIELD_MULTIPLIER.hour);
    const hourRemaining = displayValue % FIELD_MULTIPLIER.hour;
    const minute = Math.floor(hourRemaining / FIELD_MULTIPLIER.minute);
    const minuteRemaining = hourRemaining % FIELD_MULTIPLIER.minute;
    const second = Math.floor(minuteRemaining / FIELD_MULTIPLIER.second);
    const millisecond = minuteRemaining % FIELD_MULTIPLIER.second;
    return {
      hour,
      minute,
      second,
      millisecond,
    };
  };

  computeTime = parts =>
    parts.hour * FIELD_MULTIPLIER.hour +
    parts.minute * FIELD_MULTIPLIER.minute +
    parts.second * FIELD_MULTIPLIER.second +
    parts.millisecond;

  render() {
    const timeParts = this.getParts();
    return (
      <span className="time-picker">
        <input
          type="text"
          name="second"
          className="time-picker__unit"
          size={2}
          onChange={this.internalFieldChange}
          value={('' + timeParts.second).padStart(2, '0')}
          onKeyDown={this.increaseDecrease}
        />
        :
        <input
          type="text"
          name="minute"
          className="time-picker__unit"
          size={2}
          onChange={this.internalFieldChange}
          value={('' + timeParts.minute).padStart(2, '0')}
          onKeyDown={this.increaseDecrease}
        />
        :
        <input
          type="text"
          name="hour"
          className="time-picker__unit"
          size={2}
          onChange={this.internalFieldChange}
          value={('' + timeParts.hour).padStart(2, '0')}
          onKeyDown={this.increaseDecrease}
        />
      </span>
    );
  }
}

export default withTheme()(TimePicker);
