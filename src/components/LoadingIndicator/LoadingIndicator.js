import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import './LoadingIndicator.scss';

const LoadingIndicator = props => (
  <CircularProgress
    value={
      typeof props.loadingPercent === 'number'
        ? props.loadingPercent
        : undefined
    }
    variant={
      typeof props.loadingPercent === 'number' ? 'static' : 'indeterminate'
    }
  />
);

LoadingIndicator.propTypes = {
  /** Optional progress between 0-100 */
  loadingPercent: PropTypes.number,
};

export default LoadingIndicator;
