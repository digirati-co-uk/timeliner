import React, { Component } from 'react';
import PropTypes from 'prop-types';

class HelloWorld extends Component {
  static propTypes = {
    /** The name to print */
    name: PropTypes.string,
  };
  static defaultProps = {
    name: 'World',
  };

  render() {
    return <h1>Hello {this.props.name}!</h1>;
  }
}

export default HelloWorld;
