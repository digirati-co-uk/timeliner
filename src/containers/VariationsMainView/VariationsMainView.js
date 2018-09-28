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

import {
  splitRangeAt,
  groupSelectedRanges,
  deleteRange,
  updateRange,
} from '../../actions/range';
import { RANGE } from '../../constants/range';
import { importDocument, updateSettings } from '../../actions/project';
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
  editMetadata,
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
  addRange = selected => () => {
    this.props.splitRangeAt(
      (selected[RANGE.END_TIME] - selected[RANGE.START_TIME]) / 2 +
        selected[RANGE.START_TIME]
    );
  };

  groupSelectedRanges = () => {
    this.props.groupSelectedRanges();
  };

  deleteRange = selected => () => {
    this.props.deleteRange(selected.id);
  };

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
      isLoaded,
      rangeToEdit,
    } = this.props;
    const selectedBubbles = Object.values(this.props.points).filter(
      bubble => bubble.isSelected
    );
    console.log('this.props.updateRange', this.props.updateRange);
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
              onAddBubble={
                selectedBubbles.length === 1
                  ? this.addRange(selectedBubbles[0])
                  : undefined
              }
              onGroupBubble={
                selectedBubbles.length > 1
                  ? this.props.groupSelectedRanges
                  : undefined
              }
              onDeleteBubble={
                selectedBubbles.length === 1
                  ? this.deleteRange(selectedBubbles[0])
                  : undefined
              }
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
                onEdit={this.props.editMetadata}
                rangeToEdit={rangeToEdit}
                onUpdateRange={this.props.updateRange}
              />
              <Footer />
            </div>
            {(audioError.code || !isLoaded) && (
              <ContentOverlay
                {...{ loadingPercent, isLoaded, audioUrl }}
                error={audioError}
              />
            )}
          </div>
          <AudioImporter
            open={isImportOpen}
            onClose={this.props.dismissImportModal}
            onImport={this.props.importDocument}
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
  importDocument: PropTypes.func.isRequired,
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
  isLoaded: state.canvas.isLoaded,
  rangeToEdit: state.viewState.metadataToEdit,
});

const mapDispatchToProps = {
  //project actions
  importDocument,
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
  editMetadata,
  //range
  splitRangeAt,
  groupSelectedRanges,
  deleteRange,
  updateRange,
};

export default connect(
  mapStateProps,
  mapDispatchToProps
)(VariationsMainView);
