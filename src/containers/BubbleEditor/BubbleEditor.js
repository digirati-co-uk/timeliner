import React from 'react';
import Measure from 'react-measure';
import { connect } from 'react-redux';
import compose from 'lodash.flow';

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
  updateViewerWidth,
} from '../../actions/viewState';

import { RANGE } from '../../constants/range';
import { PROJECT } from '../../constants/project';
import { VIEWSTATE } from '../../constants/viewState';
import { selectRange, splitRangeAt, movePoint } from '../../actions/range';
import pan from '../../hocs/pan';
import dragPlayhead from '../../hocs/dragPlayhead';
import dragBubbleMarker from '../../hocs/dragBubbleMarker';
import dragMarker from '../../hocs/dragMarker';
import { selectMarker, updateMarker } from '../../actions/markers';

const isOSX = navigator.userAgent.indexOf('Mac OS X') !== -1;

class BubbleEditor extends React.Component {
  constructor(props) {
    super(props);
  }

  toggleSelects = (point, ev) => {
    const deselectOthers = !(isOSX ? ev.metaKey : ev.ctrlKey);
    this.props.selectRange(point.id, !point.isSelected, deselectOthers);
  };

  getTimePoints = () =>
    Array.from(
      Object.values(this.props.points).reduce((timePointsSet, bubble) => {
        timePointsSet.add(bubble[RANGE.START_TIME]);
        timePointsSet.add(bubble[RANGE.END_TIME]);
        return timePointsSet;
      }, new Set())
    ).sort((p1, p2) => p1 - p2);

  dragStart = (resource, ev) => {
    ev.preventDefault();
    ev.stopPropagation();

    const {
      dragStartBubbleMarker,
      dragStartPlayhead,
      dragStartMarker,
    } = this.props;

    if (resource.type === 'marker') {
      return dragStartMarker(resource, ev);
    }

    if (resource.type === 'time-point') {
      // Return if first or last point.
      if (
        resource.index === 0 ||
        resource.index === this.getTimePoints().length - 1
      ) {
        return;
      }

      return dragStartBubbleMarker(resource, ev);
    }

    if (resource.type === 'scrubber') {
      return dragStartPlayhead(resource, ev);
    }
  };

  setDimensions = dimensions => {
    this.props.updateViewerWidth(dimensions.width);
  };

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
      // Pan hoc
      onPanStart,
      viewport,
      // Drag bubble marker hoc
      bubbleMarkerMovement,
      // Drag playhead hoc
      playhead,
      // Drag marker
      markerMovement,
      viewerWidth,
    } = this.props;

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
            onResize={contentRect => this.setDimensions(contentRect.bounds)}
          >
            {({ measureRef }) => (
              <div
                ref={measureRef}
                style={blackAndWhiteMode ? { filter: 'grayscale(1.0)' } : {}}
              >
                <BubbleDisplay
                  points={this.props.points}
                  width={viewerWidth}
                  height={200}
                  x={viewport.startX !== -1 ? viewport.x : x}
                  zoom={zoom}
                  bubbleHeight={bubbleHeight}
                  shape={bubbleStyle}
                  onPanStart={onPanStart}
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
                          onClick={this.toggleSelects}
                        />
                      ))
                  }
                </BubbleDisplay>
                <TimelineScrubber
                  runTime={runTime}
                  currentTime={currentTime}
                  zoom={zoom}
                  x={viewport.startX !== -1 ? viewport.x : x}
                  width={viewerWidth}
                  timePoints={timePoints}
                  markerMovement={markerMovement}
                  bubbleMarkerMovement={bubbleMarkerMovement}
                  onUpdateTime={onUpdateTime}
                  onClickPoint={splitRange}
                  dragStart={this.dragStart}
                  showTimes={this.props.showTimes}
                  isPlayheadUpdating={playhead.isUpdating}
                  playheadX={playhead.x}
                  markers={this.props.markers}
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
  markers: state.markers.visible ? state.markers.list : {},
  zoom: state.viewState[VIEWSTATE.ZOOM],
  x: state.viewState[VIEWSTATE.X],
  viewerWidth: state.viewState[VIEWSTATE.VIEWER_WIDTH],
  bubbleHeight: state.project[PROJECT.BUBBLE_HEIGHT],
  bubbleStyle: state.project[PROJECT.BUBBLE_STYLE],
  showTimes: state.project[PROJECT.SHOW_TIMES],
  blackAndWhiteMode: state.project[PROJECT.BLACK_N_WHITE],
  backgroundColour: state.project[PROJECT.BACKGROUND_COLOUR],
  showMarkers: state.project[PROJECT.SHOW_MARKERS],
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
  updateMarker,
  selectMarker,
  updateViewerWidth,
};

export default compose(
  pan,
  dragBubbleMarker,
  dragPlayhead,
  dragMarker,
  connect(
    mapStateProps,
    mapDispatchToProps
  )
)(BubbleEditor);
