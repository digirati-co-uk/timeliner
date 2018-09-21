import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import MetadataDisplay from '../MetadataDisplay/MetadataDisplay';
import { Grid, Card, CardContent, CardHeader } from '@material-ui/core';

const TimeMetadata = props => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'stretch',
    }}
  >
    <div
      style={{
        flex: 2,
        paddingRight: 16,
      }}
    >
      <div
        style={{
          background: 'white',
          padding: 16,
        }}
      >
        <h5>Annotations</h5>
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
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'stretch',
        flexDirection: 'row',
      }}
    >
      <div
        style={{
          width: '100%',
          background: 'white',
          padding: '0 16px 16px 16px',
        }}
      >
        <h5>Project</h5>
        testda asdf asf asd fasdf asdf asdfasfa<br />
        sadf asdf asfdas
        df asdfasdf
      </div>
    </div>
  </div>
);

TimeMetadata.propTypes = {
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

export default TimeMetadata;
