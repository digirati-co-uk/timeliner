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
import VerifyDialog from '../../components/VerifyDialog/VerifyDialog';

import BubbleEditor from '../BubbleEditor/BubbleEditor';
import Audio from '../Audio/Audio';

import {
  splitRangeAt,
  groupSelectedRanges,
  scheduleDeleteRanges,
  updateRange,
} from '../../actions/range';
import { RANGE } from '../../constants/range';
import { PROJECT, PROJECT_SETTINGS_KEYS } from '../../constants/project';
import { VIEWSTATE } from '../../constants/viewState';
import {
  importDocument,
  updateSettings,
  resetDocument,
  exportDocument,
} from '../../actions/project';
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
  previousBubble,
  nextBubble,
  confirmYes,
  confirmNo,
  editProjectMetadata,
  cancelProjectMetadataEdits,
  saveProjectMetadata,
} from '../../actions/viewState';
import { addMarkerAtTime } from '../../actions/markers';

import './VariationsMainView.scss';
import { getRangeList, getSelectedRanges } from '../../reducers/range';
import {
  AuthCookieService1,
  resolveAvResource,
} from '../AuthResource/AuthResource';
import { actions as undoActions } from 'redux-undo-redo';

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
      spacing: {
        unit: 4,
      },
      shape: {
        borderRadius: 2,
      },
      typography: {
        fontSize: 12,
      },
      mixins: {
        toolbar: {
          minHeight: 36,
        },
      },
    });
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

  deleteRanges = ranges => () => {
    this.props.deleteRanges(ranges);
  };

  isGroupingPossible = selectedRanges => {
    const newRangeMinMax = selectedRanges.reduce(
      (newRange, bubble) => {
        newRange.startTime = Math.min(newRange.startTime, bubble.startTime);
        newRange.endTime = Math.max(newRange.endTime, bubble.endTime);
        return newRange;
      },
      {
        startTime: Number.MAX_SAFE_INTEGER,
        endTime: Number.MIN_SAFE_INTEGER,
      }
    );
    const tallBubbles = Object.values(this.props.points).filter(
      bubble => bubble.depth > 1
    );
    return (
      tallBubbles.filter(
        bubble =>
          (bubble.startTime < newRangeMinMax.startTime &&
            newRangeMinMax.startTime < bubble.endTime &&
            bubble.endTime < newRangeMinMax.endTime) ||
          (newRangeMinMax.startTime < bubble.startTime &&
            bubble.startTime < newRangeMinMax.endTime &&
            newRangeMinMax.endTime < bubble.endTime) ||
          (bubble.startTime === newRangeMinMax.startTime &&
            bubble.endTime === newRangeMinMax.endTime)
      ).length === 0
    );
  };

  isSplittingPossible = () => {
    return !Object.values(this.props.points)
      .reduce((allPoints, range) => {
        allPoints.add(range.startTime);
        allPoints.add(range.endTime);
        return allPoints;
      }, new Set([]))
      .has(this.props.currentTime);
  };

  splitRange = () => this.props.splitRangeAt(this.props.currentTime);

  addMarker = () => this.props.addMarkerAtTime(this.props.currentTime);

  getAuthService = () => {
    const annotationPages = this.props.annotationPages;
    if (
      annotationPages &&
      annotationPages[0] &&
      annotationPages[0].items &&
      annotationPages[0].items[0]
    ) {
      const avResource = resolveAvResource(annotationPages[0].items[0]);
      return avResource.service;
    }
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
      settings,
      selectedRanges,
    } = this.props;
    return (
      <div className="variations-app">
        <MuiThemeProvider theme={this.theme}>
          <VariationsAppBar
            title={manifestLabel}
            onImportButtonClicked={this.props.showImportModal}
            onSettingsButtonClicked={this.props.showSettingsModal}
            canUndo={this.props.canUndo}
            canRedo={this.props.canRedo}
            onRedo={this.props.onRedo}
            onUndo={this.props.onUndo}
            onSave={null}
            onTitleChange={() => {}}
          />
          <div className="variations-app__content">
            <AuthCookieService1
              key={this.props.authService}
              service={
                this.props.authService ? this.props.authService[0] : null
              }
            >
              <BubbleEditor key={'bubble--' + this.props.url} />
              {this.props.url ? (
                <Audio key={'audio--' + this.props.url} />
              ) : null}
              <AudioTransportBar
                isPlaying={isPlaying}
                volume={volume}
                currentTime={currentTime}
                runTime={runTime}
                onVolumeChanged={this.props.setVolume}
                onPlay={this.props.play}
                onPause={this.props.pause}
                onNextBubble={this.props.nextBubble}
                onPreviousBubble={this.props.previousBubble}
                onScrubAhead={this.props.fastForward}
                onScrubBackwards={this.props.fastReward}
                onAddBubble={
                  this.isSplittingPossible() ? this.splitRange : null
                }
                onGroupBubble={
                  selectedRanges.length > 1 &&
                  this.isGroupingPossible(selectedRanges)
                    ? this.props.groupSelectedRanges
                    : null
                }
                onDeleteBubble={
                  selectedRanges.length > 0 &&
                  _points.length > 1 &&
                  _points.length - selectedRanges.length > 0
                    ? this.deleteRanges(selectedRanges)
                    : null
                }
                onAddMarker={this.addMarker}
              />
            </AuthCookieService1>
            <div className="variations-app__metadata-editor">
              <ProjectMetadata
                currentTime={currentTime}
                runTime={runTime}
                manifestLabel={manifestLabel}
                manifestSummary={manifestSummary}
                ranges={_points}
                onEdit={this.props.editMetadata}
                rangeToEdit={rangeToEdit}
                onUpdateRange={this.props.updateRange}
                blackAndWhiteMode={this.props.settings[PROJECT.BLACK_N_WHITE]}
                projectMetadataEditorOpen={this.props.showMetadataEditor}
                onEditProjectMetadata={this.props.editProjectMetadata}
                onSaveProjectMetadata={this.props.saveProjectMetadata}
                onEraseButtonClicked={this.props.resetDocument}
                onSaveButtonClicked={this.props.exportDocument}
                onCancelEditingProjectMetadata={
                  this.props.cancelProjectMetadataEdits
                }
                url={this.props.url}
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
            error={this.props.importError}
            onClose={this.props.url ? this.props.dismissImportModal : null}
            onImport={this.props.importDocument}
          />
          <SettingsPopup
            open={isSettingsOpen}
            onClose={this.props.dismissSettingsModal}
            onSave={this.props.updateSettings}
            settings={settings}
          />
          <VerifyDialog
            open={this.props.verifyDialog.open}
            title={this.props.verifyDialog.title}
            onClose={this.props.confirmNo}
            onProceed={this.props.confirmYes}
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
  url: PropTypes.string,
  play: PropTypes.func,
  pause: PropTypes.func,
  dismissImportModal: PropTypes.func,
  dismissSettingsModal: PropTypes.func,
  volume: PropTypes.number.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  isLoaded: PropTypes.bool.isRequired,
  importError: PropTypes.string,
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
  exportDocument: PropTypes.func.isRequired,
  addMarkerAtTime: PropTypes.func.isRequired,
  settings: PropTypes.object,
};

const mapStateProps = state => ({
  volume: state.viewState.volume,
  isPlaying: state.viewState.isPlaying,
  currentTime: state.viewState.currentTime,
  authService: state.canvas.service,
  annotationPages: state.canvas.items,
  url: state.canvas.url,
  runTime: state.viewState.runTime,
  manifestLabel: state.project.title,
  importError: state.project.error,
  manifestSummary: state.project.description,
  points: Object.values(getRangeList(state)),
  selectedRanges: getSelectedRanges(state),
  isImportOpen: state.viewState.isImportOpen,
  isSettingsOpen: state.viewState.isSettingsOpen,
  audioUrl: state.canvas.url,
  audioError: state.canvas.error,
  loadingPercent: state.canvas.loadingPercent,
  isLoaded: state.canvas.isLoaded,
  rangeToEdit: state.viewState.metadataToEdit,
  verifyDialog: state.viewState.verifyDialog,
  showMetadataEditor: state.viewState[VIEWSTATE.PROJECT_METADATA_EDITOR_OPEN],
  canUndo: state.undoHistory.undoQueue.length > 0,
  canRedo: state.undoHistory.redoQueue.length > 0,
  //settings
  settings: PROJECT_SETTINGS_KEYS.reduce((acc, next) => {
    acc[next] = state.project[next];
    return acc;
  }, {}),
});

const mapDispatchToProps = {
  //project actions
  importDocument,
  updateSettings,
  resetDocument,
  exportDocument,
  editProjectMetadata,
  cancelProjectMetadataEdits,
  saveProjectMetadata,
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
  previousBubble,
  nextBubble,
  confirmYes,
  confirmNo,
  //range
  splitRangeAt,
  groupSelectedRanges,
  deleteRanges: scheduleDeleteRanges,
  updateRange,
  // markers
  addMarkerAtTime,
  // Undo
  onUndo: undoActions.undo,
  onRedo: undoActions.redo,
};

export default connect(
  mapStateProps,
  mapDispatchToProps
)(VariationsMainView);
