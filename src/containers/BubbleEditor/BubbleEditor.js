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
import { VIEWSTATE } from '../../constants/viewState';
import { selectRange, splitRangeAt, movePoint } from '../../actions/range';

const isOSX = navigator.userAgent.indexOf('Mac OS X') !== -1;

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
      viewportX: 0,
      viewportStartX: 0,
      isPlayheadUpdating: false,
      playheadX: 0,
      scrobberBounds: null,
    };
  }

  toggleSelects = (point, ev) => {
    const deselectOthers = !(isOSX ? ev.metaKey : ev.ctrlKey);
    this.props.selectRange(point.id, !point.isSelected, deselectOthers);
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

  playheadDragMove = ev => {
    if (this.state.isPlayheadUpdating) {
      // in order to smooth drag
      this.clearTextSelection();
      const positionRatio =
        (ev.pageX - this.state.scrobberBounds.left) /
        this.state.scrobberBounds.width;
      const time = positionRatio * this.props.runTime;
      this.setState({
        playheadX: time,
      });
    }
  };

  playheadDragEnd = ev => {
    if (this.state.isPlayheadUpdating) {
      this.props.onUpdateTime(this.state.playheadX);
      this.setState({
        selectedPoint: -1,
        isPlayheadUpdating: false,
        playheadX: 0,
      });
    }
    document.body.removeEventListener('mousemove', this.playheadDragMove);
    document.body.removeEventListener('mouseup', this.playheadDragEnd);
  };

  dragStart = ev => {
    if (
      ev.target === ev.target.parentNode.firstChild ||
      ev.target === ev.target.parentNode.lastChild.previousSibling
    ) {
      return;
    }
    if (
      ev.target.className === 'playhead' ||
      ev.target.className === 'timeline-scrubber'
    ) {
      const scrobberBounds = ev.currentTarget.getBoundingClientRect();
      const positionRatio =
        (ev.pageX - scrobberBounds.left) / scrobberBounds.width;
      const time = positionRatio * this.props.runTime;
      document.body.addEventListener('mousemove', this.playheadDragMove);
      document.body.addEventListener('mouseup', this.playheadDragEnd);
      this.setState({
        selectedPoint: -1,
        isPlayheadUpdating: true,
        playheadX: time,
        scrobberBounds,
      });
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
    ev.preventDefault(); // Let's stop this event.
    ev.stopPropagation(); // Really this time.
    if (this.state.selectedPoint !== -1) {
      document.body.removeEventListener('mousemove', this.dragMove);
      document.body.removeEventListener('mouseup', this.dragEnd);
      const timePoints = this.getTimePoints();
      const originalX = timePoints[this.state.selectedPoint];
      const dX =
        (((ev.pageX - this.state.startX) / this.state.dimensions.width) *
          this.props.runTime) /
        this.props.zoom;

      this.props.movePoint(
        Math.min(
          Math.max(originalX + dX, timePoints[this.state.selectedPoint - 1]),
          timePoints[this.state.selectedPoint + 1]
        ),
        originalX
      );
    }
    this.setState({
      selectedPoint: -1,
    });
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
    this.clearTextSelection();
    const dX = ev.pageX - this.state.startX;
    const dXz = dX / this.props.zoom;
    this.setState({
      viewportX: Math.min(
        Math.max(0, this.state.viewportStartX - dXz),
        this.state.dimensions.width * this.props.zoom -
          this.state.dimensions.width
      ),
    });
  };

  panEnd = ev => {
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.x !== this.props.x) {
      this.setState({
        viewportX: nextProps.x,
        viewportStartX: -1,
      });
    }
  }

  render() {
    const _points = this.props.points;
    const {
      runTime,
      currentTime,
      zoom,
      x,
      onUpdateTime,
      splitRange,
      bubbleHeight,
      bubbleStyle,
      blackAndWhiteMode,
    } = this.props;
    const {
      dimensions,
      selectedPoint,
      deltaX,
      viewportX,
      viewportStartX,
    } = this.state;

    const timePoints = this.getTimePoints();

    let selectedPointValue = 0;
    let substituteValue = 0;
    if (selectedPoint !== -1) {
      selectedPointValue = timePoints[selectedPoint];
      timePoints[selectedPoint] += Math.max(
        ((deltaX / dimensions.width) * runTime) / zoom
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
              <div
                ref={measureRef}
                style={blackAndWhiteMode ? { filter: 'grayscale(1.0)' } : {}}
              >
                <BubbleDisplay
                  points={_points}
                  width={this.state.dimensions.width}
                  height={200}
                  x={viewportStartX !== -1 ? viewportX : x}
                  zoom={zoom}
                  bubbleHeight={bubbleHeight}
                  shape={bubbleStyle}
                  onPanStart={this.onPanStart}
                >
                  {points =>
                    points
                      .sort((b1, b2) => {
                        return b2.point.depth - b1.point.depth === 0
                          ? b1.x - b2.x
                          : b2.point.depth - b1.point.depth;
                      })
                      .map(
                        (bubble, n) =>
                          console.log(this.state, n) || (
                            <SingleBubble
                              key={`bk-${bubble.point.id}`}
                              {...bubble}
                              x={
                                this.state.selectedPoint === n
                                  ? bubble.x + this.state.deltaX
                                  : bubble.x
                              }
                              width={
                                this.state.selectedPoint - 1 === n
                                  ? bubble.width + this.state.deltaX
                                  : this.state.selectedPoint === n
                                  ? bubble.width - this.state.deltaX
                                  : bubble.width
                              }
                              onClick={this.toggleSelects}
                            />
                          )
                      )
                  }
                </BubbleDisplay>
                <TimelineScrubber
                  runTime={runTime}
                  currentTime={currentTime}
                  zoom={zoom}
                  x={viewportStartX !== -1 ? viewportX : x}
                  width={this.state.dimensions.width}
                  timePoints={timePoints}
                  onUpdateTime={onUpdateTime}
                  onClickPoint={splitRange}
                  dragStart={this.dragStart}
                  selectedPoint={this.state.selectedPoint}
                  showTimes={this.props.showTimes}
                  isPlayheadUpdating={this.state.isPlayheadUpdating}
                  playheadX={this.state.playheadX}
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
  currentTime: state.viewState[VIEWSTATE.CURRENT_TIME],
  runTime: state.viewState[VIEWSTATE.RUNTIME],
  points: state.range,
  zoom: state.viewState[VIEWSTATE.ZOOM],
  x: state.viewState[VIEWSTATE.X],
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
