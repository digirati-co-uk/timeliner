import React, { Component } from 'react';
import { RANGE } from '../constants/range';
import clearTextSelection from '../utils/clearTextSelection';

export default function dragPlayhead(WrappedComponent) {
  return class DragBubbleMarker extends Component {
    state = {
      markerMovement: null,
      dimensions: {
        width: -1,
        height: -1,
      },
    };

    // @todo move to utility.
    getTimePoints = () =>
      Array.from(
        Object.values(this.props.points).reduce((timePointsSet, bubble) => {
          timePointsSet.add(bubble[RANGE.START_TIME]);
          timePointsSet.add(bubble[RANGE.END_TIME]);
          return timePointsSet;
        }, new Set())
      ).sort((p1, p2) => p1 - p2);

    dragStart = (resource, ev) => {
      document.body.addEventListener('mousemove', this.dragMove);
      document.body.addEventListener('mouseup', this.dragEnd);
      this.setState({
        markerMovement: {
          selectedPoint: resource.index,
          markerX: resource.x,
          startX: ev.pageX,
          deltaX: 0,
          deltaTime: 0,
        },
      });
    };

    dragMove = ev => {
      const { runTime, zoom } = this.props;
      const { markerMovement, dimensions } = this.state;
      if (markerMovement.selectedPoint < 0) {
        return;
      }
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
      const { markerMovement } = this.state;

      // Remove events.
      document.body.removeEventListener('mousemove', this.dragMove);
      document.body.removeEventListener('mouseup', this.dragEnd);

      // Calculate new time point.
      const timePoints = this.getTimePoints();
      const dX =
        (((ev.pageX - markerMovement.startX) / this.state.dimensions.width) *
          this.props.runTime) /
        this.props.zoom;

      this.props.movePoint(
        Math.min(
          Math.max(
            timePoints[markerMovement.selectedPoint] + dX,
            timePoints[markerMovement.selectedPoint - 1]
          ),
          timePoints[markerMovement.selectedPoint + 1]
        ),
        timePoints[markerMovement.selectedPoint]
      );

      this.setState({
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
          bubbleMarkerMovement={this.state.markerMovement}
          setDimensions={this.setDimensions}
          dragStartBubbleMarker={this.dragStart}
        />
      );
    }
  };
}
