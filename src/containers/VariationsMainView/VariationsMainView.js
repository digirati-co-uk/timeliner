import React from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { connect } from 'react-redux';

import VariationsAppBar from '../../components/VariationsAppBar/VariationsAppBar';
import AudioTransportBar from '../../components/AudioTransportBar/AudioTransportBar';
import ProjectMetadata from '../../components/Metadata/Metadata';
import AudioImporter from '../../components/AudioImporter/AudioImporter';
import SettingsPopup from '../../components/SettingsPopoup/SettingsPopup';
import Footer from '../../components/Footer/Footer';
import ContentOverlay from '../../components/ContentOverlay/ContentOverlay';

import BubbleEditor from '../BubbleEditor/BubbleEditor';
import Audio from '../Audio/Audio';

import { updateSettings } from '../../actions/project';
import {
  showImportModal,
  showSettingsModal,
  setVolume,
  play,
  pause,
  dismissImportModal,
  dismissSettingsModal,
  fastForward,
  fastReward,
} from '../../actions/viewState';

import './VariationsMainView.scss';

class VariationsMainView extends React.Component {
  constructor(props) {
    super(props);
    this.theme = createMuiTheme({
      palette: {
        primary: {
          light: '#757ce8',
          main: '#3f50b5',
          dark: '#002884',
          contrastText: '#fff',
        },
        secondary: {
          light: '#d2abf3',
          main: '#C797F0',
          dark: '#8b69a8',
          contrastText: '#000',
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
      currentTime,
      audioUrl,
      runTime,
      manifestLabel,
      manifestSummary,
      isImportOpen,
      isSettingsOpen,
      audioError,
      loadingPercent,
      isLoading,
    } = this.props;
    const timePoints = Array.from(
      Object.values(this.props.points).reduce((_timePoints, bubble) => {
        _timePoints.add(bubble.startTime);
        _timePoints.add(bubble.endTime);
        return _timePoints;
      }, new Set())
    );
    return (
      <div className="variations-app">
        <MuiThemeProvider theme={this.theme}>
          <VariationsAppBar
            title={manifestLabel}
            onImportButtonClicked={this.props.showImportModal}
            onEraseButtonClicked={() => {}}
            onSaveButtonClicked={() => {}}
            onSettingsButtonClicked={this.props.showSettingsModal}
            onTitleChange={() => {}}
          />
          <div className="variations-app__content">
            <BubbleEditor />
            <Audio />
            <AudioTransportBar
              {...{
                isPlaying,
                volume,
                currentTime,
                runTime,
              }}
              onVolumeChanged={this.props.setVolume}
              onPlay={this.props.play}
              onPause={this.props.pause}
              onNextBubble={() => {}}
              onPreviousBubble={() => {}}
              onScrubAhead={this.props.fastForward}
              onScrubBackwards={this.props.fastReward}
            />
            <div className="variations-app__metadata-editor">
              <ProjectMetadata
                {...{
                  currentTime,
                  runTime,
                  manifestLabel,
                  manifestSummary,
                }}
                ranges={_points}
              />
              <Footer />
            </div>
            {(audioError.code || isLoading) && (
              <ContentOverlay
                {...{ loadingPercent, isLoading, audioUrl }}
                error={audioError}
              />
            )}
          </div>
          <AudioImporter
            open={isImportOpen}
            onClose={this.props.dismissImportModal}
            onImport={manifest => {}}
          />
          <SettingsPopup
            open={isSettingsOpen}
            onClose={this.props.dismissSettingsModal}
            onSave={this.props.updateSettings}
          />
        </MuiThemeProvider>
      </div>
    );
  }
}

VariationsMainView.propTypes = {
  updateSettings: PropTypes.func,
  showImportModal: PropTypes.func,
  showSettingsModal: PropTypes.func,
  setVolume: PropTypes.func.isRequired,
  play: PropTypes.func,
  pause: PropTypes.func,
  dismissImportModal: PropTypes.func,
  dismissSettingsModal: PropTypes.func,
  volume: PropTypes.number.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  currentTime: PropTypes.number.isRequired,
  runTime: PropTypes.number.isRequired,
  manifestLabel: PropTypes.string.isRequired,
  manifestSummary: PropTypes.string.isRequired,
  points: PropTypes.array,
  isImportOpen: PropTypes.bool.isRequired,
  isSettingsOpen: PropTypes.bool.isRequired,
  fastForward: PropTypes.func.isRequired,
  fastReward: PropTypes.func.isRequired,
};

const mapStateProps = state => ({
  volume: state.viewState.volume,
  isPlaying: state.viewState.isPlaying,
  currentTime: state.viewState.currentTime,
  runTime: state.viewState.runTime,
  manifestLabel: state.project.title,
  manifestSummary: state.project.description,
  points: Object.values(state.range),
  isImportOpen: state.viewState.isImportOpen,
  isSettingsOpen: state.viewState.isSettingsOpen,
  audioUrl: state.canvas.url,
  audioError: state.canvas.error,
  loadingPercent: state.canvas.loadingPercent,
  isLoading: state.canvas.isLoading,
});

const mapDispatchToProps = {
  //project actions
  updateSettings,
  //view state actions
  showImportModal,
  showSettingsModal,
  setVolume,
  play,
  pause,
  dismissImportModal,
  dismissSettingsModal,
  fastForward,
  fastReward,
};

export default connect(
  mapStateProps,
  mapDispatchToProps
)(VariationsMainView);
