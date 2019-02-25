import React, { Component } from 'react';
import clearTextSelection from '../utils/clearTextSelection';

export default function pan(WrappedComponent) {
  return class Pan extends Component {
    state = {
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
      const { viewerWidth, zoom } = this.props;
      const { viewportStartX, startX } = this.state;
      clearTextSelection();
      const dX = ev.pageX - startX;
      this.setState({
        viewportX: Math.min(
          Math.max(0, viewportStartX - dX),
          viewerWidth * zoom - viewerWidth
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
          onPanStart={this.onPanStart}
        />
      );
    }
  };
}
