import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './HelloWorld.scss';

class HelloWorld extends Component {
  static propTypes = {
    /** The name to print */
    name: PropTypes.string,
  };
  static defaultProps = {
    name: 'World',
  };

  render() {
    return <h1 className="hello-world">Hello {this.props.name}!</h1>;
  }
}

export default HelloWorld;
