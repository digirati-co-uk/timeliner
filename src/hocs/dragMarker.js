import React, { Component } from 'react';
import { RANGE } from '../constants/range';
import clearTextSelection from '../utils/clearTextSelection';

export default function dragMarker(WrappedComponent) {
  return class DragMarker extends Component {
    state = {
      markerMovement: null,
      resource: null,
      dimensions: {
        width: -1,
        height: -1,
      },
    };

    dragStart = (resource, ev) => {
      document.body.addEventListener('mousemove', this.dragMove);
      document.body.addEventListener('mouseup', this.dragEnd);
      this.setState({
        click: true,
        resource,
        markerMovement: {
          selectedPoint: resource.index,
          markerX: resource.x,
          startX: ev.pageX,
          deltaX: 0,
          deltaTime: 0,
        },
      });
      setTimeout(() => {
        this.setState({ click: false });
      }, 1000);
    };

    dragMove = ev => {
      const { runTime, zoom } = this.props;
      const { markerMovement, dimensions } = this.state;
      // in order to smooth drag
      clearTextSelection();
      const deltaX = ev.clientX - markerMovement.startX;

      this.setState({
        markerMovement: {
          ...markerMovement,
          deltaX: deltaX,
          deltaTime: ((deltaX / dimensions.width) * runTime) / zoom,
        },
      });
    };

    dragEnd = ev => {
      ev.preventDefault();
      ev.stopPropagation();
      const { markerMovement, resource } = this.state;

      // Remove events.
      document.body.removeEventListener('mousemove', this.dragMove);
      document.body.removeEventListener('mouseup', this.dragEnd);

      if (Math.abs(markerMovement.deltaX) > 5 || this.state.click === false) {
        // Calculate new time point.
        const time =
          (((ev.pageX - markerMovement.startX) / this.state.dimensions.width) *
            this.props.runTime) /
          this.props.zoom;

        this.props.updateMarker(resource.id, { time: resource.time + time });
      } else if (this.state.click === true) {
        this.props.selectMarker(resource.id);
      }

      this.setState({
        resource: null,
        markerMovement: null,
      });
    };

    setDimensions = dimensions => {
      if (this.props.setDimensions) {
        this.props.setDimensions(dimensions);
      }
      this.setState({ dimensions });
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          markerMovement={this.state.markerMovement}
          setDimensions={this.setDimensions}
          dragStartMarker={this.dragStart}
        />
      );
    }
  };
}
