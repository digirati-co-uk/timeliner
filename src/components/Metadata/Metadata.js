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

const Meta = posed.div({
  enter: { y: 0, opacity: 1, delay: 250 },
  exit: {
    y: 40,
    opacity: 0,
    transition: { delay: 100, duration: 200 },
  },
});

const fix = num => parseInt((num || 0).toFixed(0), 10);

const Metadata = props => (
  <div className="metadata">
    <div className="metadata__annotations">
      <div className="metadata__annotations-content">
        <Typography variant="subheading" color="textSecondary">
          Annotations
        </Typography>
        <div className="metadata__content">
          <PoseGroup animateOnMount={true}>
            {props.ranges
              .filter(
                range =>
                  fix(range.startTime) <= fix(props.currentTime) &&
                  fix(range.endTime) > fix(props.currentTime)
              )
              .sort(
                (a, b) => b.endTime - b.startTime - (a.endTime - a.startTime)
              )
              .map(range => console.log(range) || range)
              .map((range, depth) =>
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
  onEditProjectMetadata: PropTypes.func,
  onSaveProjectMetadata: PropTypes.func,
  onSaveButtonClicked: PropTypes.func,
  onEraseButtonClicked: PropTypes.func,
  /** Audio url */
  url: PropTypes.string,
};

Metadata.defaultProps = {
  blackAndWhiteMode: false,
};

export default Metadata;
