import React, { Component } from 'react';
import clearTextSelection from '../utils/clearTextSelection';

export default function dragMarker(WrappedComponent) {
  return class DragMarker extends Component {
    state = {
      markerMovement: null,
      resource: null,
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
      const { runTime, zoom, viewerWidth } = this.props;
      const { markerMovement } = this.state;
      // in order to smooth drag
      clearTextSelection();
      const deltaX = ev.clientX - markerMovement.startX;

      this.setState({
        markerMovement: {
          ...markerMovement,
          deltaX: deltaX,
          deltaTime: ((deltaX / viewerWidth) * runTime) / zoom,
        },
      });
    };

    dragEnd = ev => {
      ev.preventDefault();
      ev.stopPropagation();
      const { viewerWidth, zoom, runTime } = this.props;
      const { markerMovement, resource, click } = this.state;

      // Remove events.
      document.body.removeEventListener('mousemove', this.dragMove);
      document.body.removeEventListener('mouseup', this.dragEnd);

      if (Math.abs(markerMovement.deltaX) > 5 || this.state.click === false) {
        // Calculate new time point.
        const time =
          (((ev.pageX - markerMovement.startX) / viewerWidth) * runTime) / zoom;

        this.props.updateMarker(resource.id, { time: resource.time + time });
      } else if (click === true) {
        this.props.selectMarker(resource.id);
      }

      this.setState({
        resource: null,
        markerMovement: null,
      });
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          markerMovement={this.state.markerMovement}
          dragStartMarker={this.dragStart}
        />
      );
    }
  };
}
