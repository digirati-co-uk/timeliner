import React from 'react';
import Measure from 'react-measure';
import { connect } from 'react-redux';
import compose from 'lodash.flow';

import BubbleDisplay from '../../components/BubbleDisplay/BubbleDisplay';
import SingleBubble from '../../components/SingleBubble/SingleBubble';
import TimelineScrubber from '../../components/TimelineScrubber/TimelineScrubber';

import {
  panToPosition,
  setCurrentTime,
  updateViewerWidth,
} from '../../actions/viewState';

import { RANGE } from '../../constants/range';
import { PROJECT } from '../../constants/project';
import { VIEWSTATE } from '../../constants/viewState';
import {
  splitRangeAt,
  movePoint,
  selectRange,
  deselectRange,
} from '../../actions/range';
import { getRangeList, getSelectedRanges } from '../../reducers/range';
import pan from '../../hocs/pan';
import dragPlayhead from '../../hocs/dragPlayhead';
import dragBubbleMarker from '../../hocs/dragBubbleMarker';
import dragMarker from '../../hocs/dragMarker';
import { selectMarker, updateMarker } from '../../actions/markers';
import { colourPalettes } from '../../config';

const isOSX = navigator.userAgent.indexOf('Mac OS X') !== -1;

class BubbleEditor extends React.Component {
  constructor(props) {
    super(props);
  }

  toggleSelects = (point, ev) => {
    const { selectedPoints } = this.props;
    const deselectOthers = !(isOSX ? ev.metaKey : ev.ctrlKey);

    if (ev.shiftKey) {
      ev.preventDefault();

      const selectedBubbles = this.props.selectedPoints.map(
        id => this.props.points[id]
      );

      const fromMin = Math.min(
        point.startTime,
        ...selectedBubbles.map(p => p.startTime)
      );
      const toMax = Math.max(
        point.endTime,
        ...selectedBubbles.map(p => p.endTime)
      );

      const newSelectedBubbles = Object.values(this.props.points)
        .filter(
          singlePoint =>
            singlePoint.startTime >= fromMin && singlePoint.endTime <= toMax
        )
        .filter(
          singlePoint =>
            this.props.selectedPoints.indexOf(singlePoint.id) === -1
        );

      newSelectedBubbles.forEach(singlePoint => {
        this.props.selectRange(singlePoint.id, false);
      });
      return;
    }

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
      selectedPoints,
      colourPalette,
      startTime,
    } = this.props;

    const timePoints = this.getTimePoints();

    return (
      <div style={{ background: this.props.backgroundColour }}>
        <div
          style={{
            position: 'relative',
            margin: '5px 5px 0 5px',
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
                {/* <BubbleDisplay
                  points={this.props.points}
                  width={viewerWidth}
                  height={window.innerHeight * 0.3}
                  x={viewport.startX !== -1 ? viewport.x : x}
                  zoom={zoom}
                  bubbleHeight={
                    bubbleHeight * ((window.innerHeight * 0.3) / 300)
                  }
                  shape={bubbleStyle}
                  onPanStart={onPanStart}
                  colourPalette={colourPalette}
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
                          onPanStart={onPanStart}
                          onClick={this.toggleSelects}
                        />
                      ))
                  }
                </BubbleDisplay> */}
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
        </div>
      </div>
    );
  }
}

const mapStateProps = state => ({
  currentTime: state.viewState[VIEWSTATE.CURRENT_TIME],
  runTime: state.viewState[VIEWSTATE.RUNTIME],
  markers: state.markers.visible ? state.markers.list : {},
  points: getRangeList(state),
  selectedPoints: getSelectedRanges(state),
  zoom: state.viewState[VIEWSTATE.ZOOM],
  x: state.viewState[VIEWSTATE.X],
  viewerWidth: state.viewState[VIEWSTATE.VIEWER_WIDTH],
  bubbleHeight: state.project[PROJECT.BUBBLE_HEIGHT],
  bubbleStyle: state.project[PROJECT.BUBBLE_STYLE],
  showTimes: state.project[PROJECT.SHOW_TIMES],
  blackAndWhiteMode: state.project[PROJECT.BLACK_N_WHITE],
  backgroundColour: state.project[PROJECT.BACKGROUND_COLOUR],
  showMarkers: state.project[PROJECT.SHOW_MARKERS],
  colourPalette:
    colourPalettes[state.project[PROJECT.COLOUR_PALETTE]] ||
    colourPalettes.default,
});

const mapDispatchToProps = {
  panToPosition,
  onUpdateTime: setCurrentTime,
  splitRange: splitRangeAt,
  selectRange,
  deselectRange,
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
