import React, { Component } from 'react';
import PropTypes from 'prop-types';
import formatDate from 'date-fns/format';
import './CurrentTimeIndicator.scss';
import bem from '@fesk/bem-js';

const style = bem.block('current-time-indicator');

class CurrentTimeIndicator extends Component {
  static propTypes = {
    /** Current time of the audio */
    currentTime: PropTypes.number.isRequired,
    /** Full runtime of audio */
    runtime: PropTypes.number.isRequired,
    /** Separator between times */
    separator: PropTypes.string,
  };

  static defaultProps = {
    separator: ' / ',
  };

  state = {
    currentFormattedTime: '00:00',
    currentFormattedRuntime: '00:00',
    error: '',
  };

  componentWillMount() {
    this.validateProps(this.props);
    this.updateTimeFormat(this.props.currentTime, this.props.runtime);
    this.updateRuntimeFormat(this.props.runtime);
  }

  validateProps(props) {
    if (props.currentTime > props.runtime) {
      return this.setState({
        error: 'Invalid time',
      });
    }

    if (this.state.error) {
      return this.setState({ error: null });
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.validateProps(nextProps);
    if (nextProps.currentTime !== this.props.currentTime) {
      this.updateTimeFormat(nextProps.currentTime, nextProps.runtime);
    }
    if (nextProps.runtime !== this.props.runtime) {
      this.updateRuntimeFormat(nextProps.runtime);
    }
  }

  updateRuntimeFormat(runtime) {
    const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;
    const date = new Date(runtime + timezoneOffset);
    if (date.toString() === 'Invalid Date') {
      return this.setState({
        error: 'Invalid runtime',
      });
    }

    const format = runtime >= 3600000 ? 'hh:mm:ss' : 'mm:ss';
    this.setState({
      currentFormattedRuntime: formatDate(date, format),
    });
  }

  updateTimeFormat(time, runtime) {
    const date = new Date(time);
    if (date.toString() === 'Invalid Date') {
      return this.setState({
        error: 'Invalid current time',
      });
    }

    if (runtime >= 3600000) {
      return this.setState({
        currentFormattedTime: formatDate(date, 'hh:mm:ss'),
      });
    }
    return this.setState({ currentFormattedTime: formatDate(date, 'mm:ss') });
  }

  render() {
    const { separator } = this.props;
    const { currentFormattedTime, currentFormattedRuntime } = this.state;

    if (this.state.error) {
      return (
        <span className={style.modifier('error')}>{this.state.error}</span>
      );
    }

    return (
      <span className={style}>
        <span className={style.element('current-time')}>
          {currentFormattedTime}
        </span>
        <span className={style.element('separator')}>{separator}</span>
        <span className={style.element('runtime')}>
          {currentFormattedRuntime}
        </span>
      </span>
    );
  }
}

export default CurrentTimeIndicator;
