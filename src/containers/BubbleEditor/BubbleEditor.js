import React from 'react';
import PropTypes from 'prop-types';
import Measure from 'react-measure';
import { connect } from 'react-redux';

import BubbleDisplay from '../../components/BubbleDisplay/BubbleDisplay';
import SingleBubble from '../../components/SingleBubble/SingleBubble';
import ZoomControls from '../../components/ZoomControls/ZoomControls';
import TimelineScrubber from '../../components/TimelineScrubber/TimelineScrubber';

import {
  zoomIn,
  zoomOut,
  resetZoom,
  panToPosition,
  setCurrentTime,
} from '../../actions/viewState';

import { RANGE } from '../../constants/range';
import { PROJECT } from '../../constants/project';
import { selectRange, splitRangeAt, movePoint } from '../../actions/range';

class BubbleEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dimensions: {
        width: -1,
        height: -1,
      },
      selectedPoint: -1,
      startX: 0,
      deltaX: 0,
    };
  }

  toggleSelects = (point, ev) => {
    this.props.selectRange(point.id, !point.isSelected);
  };

  getTimePoints = () =>
    Array.from(
      Object.values(this.props.points).reduce((_timePoints, bubble) => {
        _timePoints.add(bubble[RANGE.START_TIME]);
        _timePoints.add(bubble[RANGE.END_TIME]);
        return _timePoints;
      }, new Set())
    ).sort((p1, p2) => p1 - p2);

  clearTextSelection = () => {
    if (window.getSelection) {
      if (window.getSelection().empty) {
        // Chrome
        window.getSelection().empty();
      } else if (window.getSelection().removeAllRanges) {
        // Firefox
        window.getSelection().removeAllRanges();
      }
    } else if (document.selection) {
      // IE?
      document.selection.empty();
    }
  };

  dragStart = ev => {
    if (
      ev.target === ev.target.parentNode.firstChild ||
      ev.target === ev.target.parentNode.lastChild
    ) {
      return;
    }
    const selectedPoint = Array.prototype.indexOf.call(
      ev.target.parentNode.childNodes,
      ev.target
    );

    document.body.addEventListener('mousemove', this.dragMove);
    document.body.addEventListener('mouseup', this.dragEnd);
    this.setState({
      selectedPoint: selectedPoint,
      startX: ev.pageX,
      deltaX: 0,
    });
  };

  dragMove = ev => {
    if (this.state.selectedPoint < 0) {
      return;
    }
    // in order to smooth drag
    this.clearTextSelection();
    this.setState({
      deltaX: ev.clientX - this.state.startX,
    });
  };

  dragEnd = ev => {
    if (this.state.selectedPoint !== -1) {
      document.body.removeEventListener('mousemove', this.dragMove);
      document.body.removeEventListener('mouseup', this.dragEnd);
      const originalX = this.getTimePoints()[this.state.selectedPoint];
      const dX =
        ((ev.pageX - this.state.startX) / this.state.dimensions.width) *
        this.props.runTime;

      this.props.movePoint(originalX + dX, originalX);
    }
    this.setState({
      selectedPoint: -1,
    });
  };

  render() {
    const _points = this.props.points;
    const {
      runTime,
      currentTime,
      zoom,
      onUpdateTime,
      splitRange,
      bubbleHeight,
      bubbleStyle,
      blackAndWhiteMode,
    } = this.props;
    const { dimensions, selectedPoint, deltaX } = this.state;

    const timePoints = this.getTimePoints();
    console.log(bubbleHeight, bubbleStyle);

    let selectedPointValue = 0;
    let substituteValue = 0;
    if (selectedPoint !== -1) {
      selectedPointValue = timePoints[selectedPoint];
      timePoints[selectedPoint] += Math.max(
        (deltaX / dimensions.width) * runTime
      );
      timePoints[selectedPoint] = Math.max(
        timePoints[selectedPoint],
        timePoints[selectedPoint - 1]
      );
      timePoints[selectedPoint] = Math.min(
        timePoints[selectedPoint],
        timePoints[selectedPoint + 1]
      );
      substituteValue = timePoints[selectedPoint];
    }

    return (
      <div
        style={{
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'relative',
            margin: '16px',
          }}
        >
          <Measure
            bounds
            onResize={contentRect => {
              this.setState({ dimensions: contentRect.bounds });
            }}
          >
            {({ measureRef }) => (
              <div ref={measureRef} 
                style={
                  blackAndWhiteMode ? {
                    filter: 'grayscale(1.0)',
                  }: {}
                }
              >
                <BubbleDisplay
                  points={_points}
                  width={this.state.dimensions.width}
                  height={200}
                  x={0}
                  zoom={zoom}
                  bubbleHeight={bubbleHeight}
                  shape={bubbleStyle}
                >
                  {points =>
                    points.map(bubble => (
                      <SingleBubble
                        key={`bk-${bubble.point.id}`}
                        {...bubble}
                        onClick={this.toggleSelects}
                      />
                    ))
                  }
                </BubbleDisplay>
                <TimelineScrubber
                  runTime={runTime}
                  currentTime={currentTime}
                  zoom={zoom}
                  timePoints={timePoints}
                  onUpdateTime={onUpdateTime}
                  onClickPoint={splitRange}
                  dragStart={this.dragStart}
                  selectedPoint={this.state.selectedPoint}
                  showTimes={this.props.showTimes}
                />
              </div>
            )}
          </Measure>
          <ZoomControls
            onZoomIn={this.props.zoomIn}
            onZoomOut={zoom > 1 ? this.props.zoomOut : null}
            onResetView={zoom !== 1 ? this.props.resetZoom : null}
          />
        </div>
      </div>
    );
  }
}

const mapStateProps = state => ({
  currentTime: state.viewState.currentTime,
  runTime: state.viewState.runTime,
  points: state.range,
  zoom: state.viewState.zoom,
  bubbleHeight: state.project[PROJECT.BUBBLE_HEIGHT],
  bubbleStyle: state.project[PROJECT.BUBBLE_STYLE],
  showTimes: state.project[PROJECT.SHOW_TIMES],
  blackAndWhiteMode: state.project[PROJECT.BLACK_N_WHITE],
});

const mapDispatchToProps = {
  zoomIn,
  zoomOut,
  resetZoom,
  panToPosition,
  onUpdateTime: setCurrentTime,
  splitRange: splitRangeAt,
  selectRange,
  movePoint,
};

export default connect(
  mapStateProps,
  mapDispatchToProps
)(BubbleEditor);
