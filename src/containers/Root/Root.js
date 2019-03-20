import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import VariationsMainView from '../VariationsMainView/VariationsMainView';
import { PersistGate } from 'redux-persist/integration/react';

const Root = ({ store, persistor, callback, hasResource, resource, noFooter, noHeader }) => {
  try {
    return (
      <Provider store={store}>
        <PersistGate loading="loading..." persistor={persistor}>
          <VariationsMainView
            callback={callback}
            hasResource={hasResource}
            resource={resource}
            noFooter={noFooter}
            noHeader={noHeader}
          />
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
