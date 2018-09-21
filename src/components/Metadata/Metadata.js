import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import MetadataDisplay from '../MetadataDisplay/MetadataDisplay';
import './Metadata.scss';

const Metadata = props => (
  <div className="metadata">
    <div className="metadata__annotations">
      <div className="metadata__annotations-content">
        <Typography variant="subheading">Annotations</Typography>
        <div className="metadata__content">
          {props.ranges
            .filter(
              range =>
                range.startTime <= props.currentTime &&
                range.endTime >= props.currentTime
            )
            .map(range => (
              <MetadataDisplay {...range} />
            ))}
        </div>
      </div>
    </div>
    <div className="metadata__project">
      <div className="metadata__project-content">
        <Typography variant="subheading">Project</Typography>
        <div className="metadata__content">
          <Typography varinant="body1" paragraph={true}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            metus urna, iaculis ac lobortis ac, fringilla non enim. Nunc
            imperdiet quis enim quis condimentum. Cras rutrum suscipit enim,
            eget egestas felis. Vestibulum a tincidunt mauris, vitae scelerisque
            augue. Ut faucibus, elit et faucibus eleifend, velit est mollis
            interdum felis nisl et elit. Pellentesque habitant morbi tristique
            senectus et netus et malesuada fames ac turpis egestas. Sed egestas
            lorem nisl. Donec a ex quis ante sodales pulvinar. Ut ultricies eget
            tellus at rhoncus. Nunc tempor mi nec varius elementum. Donec
            euismod est sed suscipit vestibulum.
          </Typography>
          <Typography varinant="body1" paragraph={true}>
            Orci varius natoque penatibus et magnis dis parturient montes,
            nascetur ridiculus mus. Nulla aliquam consequat nisi nec dictum.
            Etiam ut tellus tempor, tempor ante ut, lobortis felis. Proin id
            turpis et felis posuere bibendum. Nullam diam urna, mattis sit amet
            velit et, facilisis vestibulum felis. Curabitur vehicula dui
            dignissim augue congue vestibulum. Integer efficitur lorem eget
            pharetra pretium. Mauris in velit sit amet augue eleifend varius.
            Sed consectetur imperdiet fermentum. Sed vel condimentum elit.
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
  runtime: PropTypes.number.isRequired,
  /** Current time */
  currentTime: PropTypes.number.isRequired,
  /** Array of Ranges */
  ranges: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      summary: PropTypes.string.isRequired,
      startTime: PropTypes.number.isRequired,
      endTime: PropTypes.number.isRequired,
      colour: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
};

export default Metadata;
