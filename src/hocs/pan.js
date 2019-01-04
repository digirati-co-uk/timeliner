import React, { Component } from 'react';
import clearTextSelection from '../utils/clearTextSelection';

export default function pan(WrappedComponent) {
  return class Pan extends Component {
    state = {
      dimensions: {
        width: -1,
        height: -1,
      },
      startX: 0,
      selectedPoint: -1,
      viewportX: 0,
      viewportStartX: 0,
      deltaX: 0,
    };

    onPanStart = ev => {
      document.body.addEventListener('mousemove', this.panMove);
      document.body.addEventListener('mouseup', this.panEnd);

      this.setState({
        selectedPoint: -1,
        startX: ev.pageX,
        viewportStartX: this.state.viewportX,
        deltaX: 0,
      });
    };

    panMove = ev => {
      clearTextSelection();
      const dX = ev.pageX - this.state.startX;
      this.setState({
        viewportX: Math.min(
          Math.max(0, this.state.viewportStartX - dX),
          this.state.dimensions.width * this.props.zoom -
            this.state.dimensions.width
        ),
      });
    };

    panEnd = () => {
      document.body.removeEventListener('mousemove', this.panMove);
      document.body.removeEventListener('mouseup', this.panEnd);
      if (this.state.viewportStartX !== -1) {
        this.props.panToPosition(this.state.viewportX);
      }
      this.setState({
        selectedPoint: -1,
        viewportStartX: -1,
      });
    };

    setDimensions = dimensions => {
      if (this.props.setDimensions) {
        this.props.setDimensions(dimensions);
      }
      this.setState({ dimensions });
    };

    componentWillReceiveProps(nextProps, nextContext) {
      if (nextProps.x !== this.props.x) {
        this.setState({
          viewportX: nextProps.x,
          viewportStartX: -1,
        });
      }
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          viewport={{
            x: this.state.viewportX,
            startX: this.state.viewportStartX,
          }}
          setDimensions={this.setDimensions}
          onPanStart={this.onPanStart}
        />
      );
    }
  };
}
