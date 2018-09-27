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
import { selectRange, splitRangeAt } from '../../actions/range';

class BubbleEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dimensions: {
        width: -1,
        height: -1,
      },
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
    );

  render() {
    const _points = this.props.points;
    const { runTime, currentTime, zoom, onUpdateTime, splitRange } = this.props;
    const timePoints = this.getTimePoints();

    return (
      <div
        style={{
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'relative',
            margin: '16px 16px 8px',
          }}
        >
          <Measure
            bounds
            onResize={contentRect => {
              this.setState({ dimensions: contentRect.bounds });
            }}
          >
            {({ measureRef }) => (
              <div ref={measureRef}>
                <BubbleDisplay
                  points={_points}
                  width={this.state.dimensions.width}
                  height={300}
                  x={0}
                  zoom={zoom}
                >
                  {points =>
                    points.map(bubble => (
                      <SingleBubble
                        key={`bk-${bubble.id}`}
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
                  points={_points}
                  onUpdateTime={onUpdateTime}
                  onClickPoint={splitRange}
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
});

const mapDispatchToProps = {
  zoomIn,
  zoomOut,
  resetZoom,
  panToPosition,
  onUpdateTime: setCurrentTime,
  splitRange: splitRangeAt,
  selectRange,
};

export default connect(
  mapStateProps,
  mapDispatchToProps
)(BubbleEditor);
