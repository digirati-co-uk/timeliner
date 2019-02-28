import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import VariationsMainView from '../VariationsMainView/VariationsMainView';
import { PersistGate } from 'redux-persist/integration/react';

const Root = ({ store, persistor }) => {
  try {
    return (
      <Provider store={store}>
        <PersistGate loading="loading..." persistor={persistor}>
          <VariationsMainView />
        </PersistGate>
      </Provider>
    );
  } catch (err) {
    return <div>{err}</div>;
  }
};

Root.propTypes = {
  store: PropTypes.object.isRequired,
};

export default Root;
