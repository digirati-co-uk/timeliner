import React, { Component } from 'react';
import clearTextSelection from '../utils/clearTextSelection';

export default function dragPlayhead(WrappedComponent) {
  return class DragPlayhead extends Component {
    state = {
      isPlayheadUpdating: false,
      playheadX: 0,
      scrubberBounds: null,
    };

    dragStart = (resource, ev) => {
      const scrubberBounds = ev.currentTarget.getBoundingClientRect();
      const positionRatio =
        (ev.pageX - scrubberBounds.left) / scrubberBounds.width;
      const time = positionRatio * this.props.runTime;

      document.body.addEventListener('mousemove', this.dragMove);
      document.body.addEventListener('mouseup', this.dragEnd);

      this.setState({
        isPlayheadUpdating: true,
        playheadX: time,
        scrubberBounds,
      });
    };

    dragMove = ev => {
      if (this.state.isPlayheadUpdating) {
        // in order to smooth drag
        clearTextSelection();
        const positionRatio =
          (ev.pageX - this.state.scrubberBounds.left) /
          this.state.scrubberBounds.width;
        const time = positionRatio * this.props.runTime;
        this.setState({
          playheadX: time,
        });
      }
    };

    dragEnd = () => {
      if (this.state.isPlayheadUpdating) {
        this.props.onUpdateTime(this.state.playheadX);
        this.setState({
          isPlayheadUpdating: false,
          playheadX: 0,
        });
      }
      document.body.removeEventListener('mousemove', this.dragMove);
      document.body.removeEventListener('mouseup', this.dragEnd);
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          playhead={{
            x: this.state.playheadX,
            isUpdating: this.state.isPlayheadUpdating,
          }}
          dragStartPlayhead={this.dragStart}
        />
      );
    }
  };
}
