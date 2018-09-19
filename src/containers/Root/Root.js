import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import VariationsMainView from '../VariationsMainView/VariationsMainView';

const Root = ({ store }) => (
  <Provider store={store}>
    <VariationsMainView />
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired,
};

export default Root;
