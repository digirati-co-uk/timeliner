import React from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import VariationsAppBar from '../../components/VariationsAppBar/VariationsAppBar';
import AudioTransportBar from '../../components/AudioTransportBar/AudioTransportBar';
import TimelineMetadata from '../../components/TimeMetadata/TimeMetadata';
import AudioImporter from '../../components/AudioImporter/AudioImporter';
import SettingsPopup from '../../components/SettingsPopoup/SettingsPopup';

import BubbleEditor from '../BubbleEditor/BubbleEditor';

import * as canvasActions from '../../actions/canvas';
import * as projectActions from '../../actions/project';
import * as rangeActions from '../../actions/range';
import * as viewStateActions from '../../actions/viewState';

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
      isImportOpen,
      isSettingsOpen,
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
            onImportButtonClicked={this.props.viewStateActions.showImportModal}
            onEraseButtonClicked={() => {}}
            onSaveButtonClicked={() => {}}
            onSettingsButtonClicked={
              this.props.viewStateActions.showSettingsModal
            }
            onTitleChange={() => {}}
          />
          <BubbleEditor />
          <AudioTransportBar
            isPlaying={isPlaying}
            volume={volume}
            onVolumeChanged={this.props.viewStateActions.setVolume}
            currentTime={currentTime}
            runTime={runTime}
            onPlay={this.props.viewStateActions.play}
            onPause={this.props.viewStateActions.pause}
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
          <AudioImporter
            open={isImportOpen}
            onClose={this.props.viewStateActions.dismissImportModal}
            onImport={manifest => {}}
          />
          <SettingsPopup
            open={isSettingsOpen}
            onClose={this.props.viewStateActions.dismissSettingsModal}
            onSave={this.props.projectActions.updateSettings}
          />
        </MuiThemeProvider>
      </div>
    );
  }
}

const mapStateProps = state => ({
  volume: state.viewState.volume,
  isPlaying: state.viewState.isPlaying,
  currentTime: state.canvas.currentTime,
  runTime: state.canvas.duration,
  manifestLabel: state.project.title,
  manifestSummary: state.project.description,
  points: Object.values(state.range),
  isImportOpen: state.viewState.isImportOpen,
  isSettingsOpen: state.viewState.isSettingsOpen,
});

const mapDispatchToProps = dispatch => ({
  canvasActions: bindActionCreators(canvasActions, dispatch),
  projectActions: bindActionCreators(projectActions, dispatch),
  rangeActions: bindActionCreators(rangeActions, dispatch),
  viewStateActions: bindActionCreators(viewStateActions, dispatch),
});

export default connect(
  mapStateProps,
  mapDispatchToProps
)(VariationsMainView);
