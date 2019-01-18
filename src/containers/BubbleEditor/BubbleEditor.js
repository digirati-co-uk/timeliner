import React from 'react';
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
import { splitRangeAt, movePoint } from '../../actions/range';
import { getRangeList, getSelectedRanges } from '../../reducers/range';

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
      scrubberBounds: null,
      markerMovement: null,
    };
  }

  toggleSelects = (point, ev) => {
    const { selectedPoints } = this.props;
    const deselectOthers = !(isOSX ? ev.metaKey : ev.ctrlKey);

    if (selectedPoints.indexOf(point.id) === -1 || deselectOthers) {
      this.props.selectRange(point.id, deselectOthers);
    } else {
      this.props.deselectRange(point.id);
    }
  };

  getTimePoints = () =>
    Array.from(
      Object.values(this.props.points).reduce((timePointsSet, bubble) => {
        timePointsSet.add(bubble[RANGE.START_TIME]);
        timePointsSet.add(bubble[RANGE.END_TIME]);
        return timePointsSet;
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

  dragMovePlayhead = ev => {
    if (this.state.isPlayheadUpdating) {
      // in order to smooth drag
      this.clearTextSelection();
      const positionRatio =
        (ev.pageX - this.state.scrubberBounds.left) /
        this.state.scrubberBounds.width;
      const time = positionRatio * this.props.runTime;
      this.setState({
        playheadX: time,
      });
    }
  };

  dragEndPlayhead = ev => {
    if (this.state.isPlayheadUpdating) {
      this.props.onUpdateTime(this.state.playheadX);
      this.setState({
        isPlayheadUpdating: false,
        playheadX: 0,
      });
    }
    document.body.removeEventListener('mousemove', this.dragMovePlayhead);
    document.body.removeEventListener('mouseup', this.dragEndPlayhead);
  };

  dragStartMarker = (resource, ev) => {
    document.body.addEventListener('mousemove', this.dragMoveMarker);
    document.body.addEventListener('mouseup', this.dragEndMarker);
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

  dragStartPlayhead = (resource, ev) => {
    const scrubberBounds = ev.currentTarget.getBoundingClientRect();
    const positionRatio =
      (ev.pageX - scrubberBounds.left) / scrubberBounds.width;
    const time = positionRatio * this.props.runTime;

    document.body.addEventListener('mousemove', this.dragMovePlayhead);
    document.body.addEventListener('mouseup', this.dragEndPlayhead);

    this.setState({
      isPlayheadUpdating: true,
      playheadX: time,
      scrubberBounds,
    });
  };

  dragStart = (resource, ev) => {
    ev.preventDefault();
    ev.stopPropagation();

    if (resource.type === 'marker') {
      // Return if first or last point.
      if (
        resource.index === 0 ||
        resource.index === this.getTimePoints().length - 1
      ) {
        return;
      }

      return this.dragStartMarker(resource, ev);
    }

    if (resource.type === 'scrubber') {
      return this.dragStartPlayhead(resource, ev);
    }
  };

  dragMoveMarker = ev => {
    const { runTime, zoom } = this.props;
    const { markerMovement, dimensions } = this.state;
    if (markerMovement.selectedPoint < 0) {
      return;
    }
    // in order to smooth drag
    this.clearTextSelection();
    const deltaX = ev.clientX - markerMovement.startX;

    this.setState({
      markerMovement: {
        ...markerMovement,
        deltaX: deltaX,
        deltaTime: ((deltaX / dimensions.width) * runTime) / zoom,
      },
    });
  };

  dragEndMarker = ev => {
    ev.preventDefault();
    ev.stopPropagation();
    const { markerMovement } = this.state;

    // Remove events.
    document.body.removeEventListener('mousemove', this.dragMoveMarker);
    document.body.removeEventListener('mouseup', this.dragEndMarker);

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

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.x !== this.props.x) {
      this.setState({
        viewportX: nextProps.x,
        viewportStartX: -1,
      });
    }
  }

  render() {
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
      selectedPoints,
    } = this.props;
    const { viewportX, viewportStartX } = this.state;

    const timePoints = this.getTimePoints();

    return (
      <div style={{ background: this.props.backgroundColour }}>
        <div
          style={{
            position: 'relative',
            margin: '16px 5px 0 5px',
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
                  points={this.props.points}
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
                      .map((bubble, n) => (
                        <SingleBubble
                          key={`bk-${bubble.point.id}`}
                          {...bubble}
                          isSelected={
                            selectedPoints.indexOf(bubble.point.id) !== -1
                          }
                          onClick={this.toggleSelects}
                        />
                      ))
                  }
                </BubbleDisplay>
                <TimelineScrubber
                  runTime={runTime}
                  currentTime={currentTime}
                  zoom={zoom}
                  x={viewportStartX !== -1 ? viewportX : x}
                  width={this.state.dimensions.width}
                  timePoints={timePoints}
                  markerMovement={this.state.markerMovement}
                  onUpdateTime={onUpdateTime}
                  onClickPoint={splitRange}
                  dragStart={this.dragStart}
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
  points: getRangeList(state),
  selectedPoints: getSelectedRanges(state),
  zoom: state.viewState[VIEWSTATE.ZOOM],
  x: state.viewState[VIEWSTATE.X],
  bubbleHeight: state.project[PROJECT.BUBBLE_HEIGHT],
  bubbleStyle: state.project[PROJECT.BUBBLE_STYLE],
  showTimes: state.project[PROJECT.SHOW_TIMES],
  blackAndWhiteMode: state.project[PROJECT.BLACK_N_WHITE],
  backgroundColour: state.project[PROJECT.BACKGROUND_COLOUR],
});

const mapDispatchToProps = {
  zoomIn,
  zoomOut,
  resetZoom,
  panToPosition,
  onUpdateTime: setCurrentTime,
  splitRange: splitRangeAt,
  selectRange: (id, deselectOthers) => ({
    type: 'SELECT_RANGE',
    payload: { id, deselectOthers },
  }),
  deselectRange: id => ({ type: 'DESELECT_RANGE', payload: { id } }),
  movePoint,
};

export default connect(
  mapStateProps,
  mapDispatchToProps
)(BubbleEditor);
