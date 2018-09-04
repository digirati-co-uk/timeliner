import React, { Component } from 'react';

export default class VolumeSliderDemo extends Component {
  constructor(props) {
    super(props);
    this.state = { volume: 70 };
  }
  onVolumeChanged = ev => {
    this.setState({
      volume: parseInt(ev.target.value, 10),
    });
  };

  render() {
    const { children } = this.props;
    const childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(child, {
        volume: this.state.volume,
        onVolumeChanged: this.onVolumeChanged,
      })
    );
    return <div>{childrenWithProps}</div>;
  }
}
