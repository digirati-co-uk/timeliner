import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import MetadataDisplay from '../MetadataDisplay/MetadataDisplay';
import MetadataEditor from '../MetadataEditor/MetadataEditor';
import './Metadata.scss';

const Metadata = props => (
  <div className="metadata">
    <div className="metadata__annotations">
      <div className="metadata__annotations-content">
        <Typography variant="subheading" color="textSecondary">
          Annotations
        </Typography>
        <div className="metadata__content">
          {props.ranges
            .filter(
              range =>
                range.startTime <= props.currentTime &&
                range.endTime > props.currentTime
            )
            .sort((a, b) => b.endTime - b.startTime - (a.endTime - a.startTime))
            .map(
              (range, depth) =>
                range.id === props.rangeToEdit ? (
                  <MetadataEditor
                    key={`metadata_editor-${range.id}`}
                    {...range}
                    onSave={props.onUpdateRange}
                    onDelete={props.onDeleteRange}
                  />
                ) : (
                  <MetadataDisplay
                    key={`metadata_display-${range.id}`}
                    {...range}
                    inset={depth}
                    onEditClick={(selectedRange => () =>
                      props.onEdit(selectedRange.id))(range)}
                    blackAndWhiteMode={props.blackAndWhiteMode}
                  />
                )
            )}
        </div>
      </div>
    </div>
    <div className="metadata__project">
      <div className="metadata__project-content">
        <Typography variant="subheading" color="textSecondary">
          Project
        </Typography>
        <div className="metadata__content">
          <Typography variant="title" component="h3">
            {props.manifestLabel}
          </Typography>
          <Typography varinant="body1" paragraph={true}>
            {props.manifestSummary}
          </Typography>
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
  /** Array of Ranges */
  ranges: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      summary: PropTypes.string,
      startTime: PropTypes.number.isRequired,
      endTime: PropTypes.number.isRequired,
      colour: PropTypes.string,
    }).isRequired
  ).isRequired,
  /** Black and white mode */
  blackAndWhiteMode: PropTypes.bool,
};

Metadata.defaultProps = {
  blackAndWhiteMode: false,
};

export default Metadata;
