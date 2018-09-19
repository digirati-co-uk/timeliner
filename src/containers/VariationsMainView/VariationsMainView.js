import React from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import Measure from 'react-measure';

import VariationsAppBar from '../../components/VariationsAppBar/VariationsAppBar';
import BubbleDisplay from '../../components/BubbleDisplay/BubbleDisplay';
import SingleBubble from '../../components/SingleBubble/SingleBubble';
import AudioTransportBar from '../../components/AudioTransportBar/AudioTransportBar';
import ZoomControls from '../../components/ZoomControls/ZoomControls';
import TimelineMetadata from '../../components/TimeMetadata/TimeMetadata';
import TimelineScrubber from '../../components/TimelineScrubber/TimelineScrubber';
import { connect } from 'react-redux';

class VariationsMainView extends React.Component {
  constructor(props) {
    super(props);
    this.theme = createMuiTheme({
      palette: {
        primary: blue,
        secondary: {
          main: '#ff5252',
        },
      },
      status: {
        danger: 'orange',
      },
    });
    this.state = {
      dimensions: {
        width: -1,
        height: -1,
      },
    };
  }
  render() {
    const _points = this.props.points;
    const {
      isPlaying,
      volume,
      onVolumeChanged,
      currentTime,
      runTime,
      manifestLabel,
      manifestSummary,
    } = this.props;
    const timePoints = Array.from(
      Object.values(this.props.points).reduce((_timePoints, bubble) => {
        _timePoints.add(bubble.startTime);
        _timePoints.add(bubble.endTime);
        return _timePoints;
      }, new Set())
    );
    return (
      <div>
        <MuiThemeProvider theme={this.theme}>
          <VariationsAppBar
            title={manifestLabel}
            onImportButtonClicked={() => {}}
            onEraseButtonClicked={() => {}}
            onSaveButtonClicked={() => {}}
            onSettingsButtonClicked={() => {}}
            onTitleChange={() => {}}
          />
          <div
            style={{
              position: 'relative',
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
                    points={_points.reduce((acc, el) => {
                      acc[el.id] = el;
                      return acc;
                    }, {})}
                    width={this.state.dimensions.width}
                    height={300}
                    x={0}
                    zoom={1}
                  >
                    {points =>
                      points.map(bubble => (
                        <SingleBubble
                          {...bubble}
                          onClick={(point, ev) => {
                            alert(JSON.stringify(point));
                          }}
                        />
                      ))
                    }
                  </BubbleDisplay>
                  <TimelineScrubber
                    runTime={runTime}
                    currentTime={currentTime}
                    timePoints={timePoints}
                    points={_points}
                  />
                </div>
              )}
            </Measure>
            <ZoomControls />
          </div>
          <AudioTransportBar
            isPlaying={isPlaying}
            volume={volume}
            onVolumeChanged={() => {}}
            currentTime={currentTime}
            runTime={runTime}
            onPlay={() => {}}
            onPause={() => {}}
            onNextBubble={() => {}}
            onPreviousBubble={() => {}}
            onScrubAhead={() => {}}
            onScrubBackwards={() => {}}
          />
          <div
            style={{
              padding: 8,
            }}
          >
            <TimelineMetadata
              ranges={_points}
              currentTime={currentTime}
              runtime={runTime}
              manifestLabel={manifestLabel}
              manifestSummary={manifestSummary}
            />
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

const mapStateProps = state => ({
  volume: state.project.volume,
  isPlaying: state.viewState.isPlaying,
  currentTime: state.canvas.currentTime,
  runTime: state.canvas.duration,
  manifestLabel: state.project.title,
  manifestSummary: state.project.description,
  points: Object.values(state.range),
});

const mapDispatchToProps = dispatch => {

};

export default connect(mapStateProps)(VariationsMainView);
