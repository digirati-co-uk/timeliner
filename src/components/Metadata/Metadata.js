import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import posed, { PoseGroup } from 'react-pose';

import MetadataDisplay from '../MetadataDisplay/MetadataDisplay';
import MetadataEditor from '../MetadataEditor/MetadataEditor';
import ProjectMetadataDisplay from '../ProjectMetadataDisplay/ProjectMetadataDisplay';
import ProjectMetadataEditor from '../ProjectMetadataEditor/ProjectMetadataEditor';

import './Metadata.scss';
import { DEFAULT_COLOURS } from '../../constants/range';
import MarkerMetadata from '../MarkerMetadata/MarkerMetadata';
import { setCurrentTime } from '../../actions/viewState';

const Meta = posed.div({
  enter: { y: 0, opacity: 1, delay: 250 },
  exit: {
    y: 40,
    opacity: 0,
    transition: { delay: 100, duration: 200 },
  },
});

const fix = num => parseInt((num || 0).toFixed(0), 10);

function getCurrentRanges(currentTime, ranges) {
  return ranges
    .filter(
      range =>
        fix(range.startTime) <= fix(currentTime) &&
        fix(range.endTime) > fix(currentTime)
    )
    .sort((a, b) => b.endTime - b.startTime - (a.endTime - a.startTime));
}

const getLastRange = ranges =>
  ranges[ranges.length - 1] || { startTime: -Infinity, endTime: Infinity };
const getMinStartTime = ranges => Math.min(...ranges.map(r => r.startTime));
const getMaxEndTime = ranges => Math.max(...ranges.map(r => r.endTime));
const getMarkers = (markers, min, max) =>
  Object.values(markers)
    .filter(marker => marker.time >= min && marker.time < max)
    .sort((a, b) => a.time - b.time);

const Metadata = props => {
  const rangesToShow = getCurrentRanges(props.currentTime, props.ranges);
  const lastRange = getLastRange(rangesToShow);

  // This is a future prop that we can offer to show more markers.
  // Not active at the moment as it requires a new interface.
  // Current set of markers are passed to the last item in the range.
  const min = props.showAllParentMarkers
    ? getMinStartTime(rangesToShow)
    : lastRange.startTime;
  const max = props.showAllParentMarkers
    ? getMaxEndTime(rangesToShow)
    : lastRange.endTime;

  const markers = getMarkers(props.markers, min, max);

  const currentMarker = [...markers]
    .sort((a, b) => {
      return (
        Math.abs(props.currentTime - b.time) -
        Math.abs(props.currentTime - a.time)
      );
    })
    .pop();

  return (
    <div className="metadata">
      <div className="metadata__annotations">
        <div className="metadata__annotations-content">
          <Typography variant="subheading" color="textSecondary">
            Annotations
          </Typography>
          <div className="metadata__content">
            <PoseGroup animateOnMount={true}>
              {rangesToShow.map((range, depth) =>
                range.id === props.rangeToEdit ? (
                  <Meta key={`edit-${range.id}`}>
                    <MetadataEditor
                      key={`metadata_editor-${range.id}`}
                      {...range}
                      colour={
                        range.colour ||
                        DEFAULT_COLOURS[range.depth % DEFAULT_COLOURS.length]
                      }
                      onSave={props.onUpdateRange}
                      onDelete={props.onDeleteRange}
                      onCancel={() => {
                        props.onEdit(null);
                      }}
                    />
                  </Meta>
                ) : (
                  <Meta key={range.id}>
                    <MetadataDisplay
                      key={`metadata_display-${range.id}`}
                      {...range}
                      inset={depth}
                      colour={
                        range.colour ||
                        DEFAULT_COLOURS[range.depth % DEFAULT_COLOURS.length]
                      }
                      onEditClick={(selectedRange => () =>
                        props.onEdit(selectedRange.id))(range)}
                      blackAndWhiteMode={props.blackAndWhiteMode}
                    />
                  </Meta>
                )
              )}
            </PoseGroup>
          </div>
          {markers.length ? (
            <Typography variant="subheading" color="textSecondary">
              Markers
            </Typography>
          ) : null}
          <div className="metadata__content">
            <PoseGroup animateOnMount={true}>
              {markers.map(marker => {
                return (
                  <Meta key={marker.id}>
                    <MarkerMetadata
                      key={marker.id}
                      highlight={marker === currentMarker}
                      marker={marker}
                      onDeleteMarker={() => props.deleteMarker(marker.id)}
                      onSaveMarker={data => props.updateMarker(marker.id, data)}
                      onGoToMarker={() => props.setCurrentTime(marker.time)}
                    />
                  </Meta>
                );
              })}
            </PoseGroup>
          </div>
        </div>
      </div>
      <div className="metadata__project">
        <div className="metadata__project-content">
          <Typography variant="subheading" color="textSecondary">
            Project
          </Typography>
          <div className="metadata__content">
            {props.projectMetadataEditorOpen ? (
              <ProjectMetadataEditor
                manifestLabel={props.manifestLabel}
                manifestSummary={props.manifestSummary}
                onSave={props.onSaveProjectMetadata}
                onCancel={props.onCancelEditingProjectMetadata}
              />
            ) : (
              <ProjectMetadataDisplay
                manifestLabel={props.manifestLabel}
                manifestSummary={props.manifestSummary}
                onEditClick={props.onEditProjectMetadata}
                onSaveButtonClicked={props.onSaveButtonClicked}
                onEraseButtonClicked={props.onEraseButtonClicked}
                url={props.url}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

Metadata.propTypes = {
  /** Current label of the manifest or range */
  manifestLabel: PropTypes.string.isRequired,
  /** Current summary of the manifest or range */
  manifestSummary: PropTypes.string.isRequired,
  /** Total runtime of manifest */
  runTime: PropTypes.number.isRequired,
  /** Current time */
  currentTime: PropTypes.number.isRequired,
  /** Range to edit */
  rangeToEdit: PropTypes.string,
  /** Activates edit mode */
  onEdit: PropTypes.func,
  /** handles update range */
  onUpdateRange: PropTypes.func,
  /** Removes range */
  onDeleteRange: PropTypes.func,
  /** Cancels range edit */
  onCancelRangeEdit: PropTypes.func,
  /** Array of Ranges */
  ranges: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
      summary: PropTypes.string,
      startTime: PropTypes.number.isRequired,
      endTime: PropTypes.number.isRequired,
      depth: PropTypes.number,
      colour: PropTypes.string,
    }).isRequired
  ).isRequired,
  /** Black and white mode */
  blackAndWhiteMode: PropTypes.bool,
  projectMetadataEditorOpen: PropTypes.bool,
  showAllParentMarkers: PropTypes.bool,
  onEditProjectMetadata: PropTypes.func,
  onSaveProjectMetadata: PropTypes.func,
  onSaveButtonClicked: PropTypes.func,
  onEraseButtonClicked: PropTypes.func,
  deleteMarker: PropTypes.func,
  /** Audio url */
  url: PropTypes.string,
};

Metadata.defaultProps = {
  blackAndWhiteMode: false,
  showAllParentMarkers: false,
};

export default Metadata;
