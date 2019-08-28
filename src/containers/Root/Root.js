import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import VariationsMainView from '../VariationsMainView/VariationsMainView';
import { PersistGate } from 'redux-persist/integration/react';

const Root = ({
  store,
  persistor,
  callback,
  hasResource,
  noFooter,
  noHeader,
  noSourceLink,
  omlTrackUri,
}) => {
  try {
    return (
      <Provider store={store}>
        <PersistGate loading="loading..." persistor={persistor}>
          <VariationsMainView
            callback={callback}
            hasResource={hasResource}
            noFooter={noFooter}
            noHeader={noHeader}
            noSourceLink={noSourceLink}
            resourceUri={omlTrackUri}
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
  omlTrackUri: PropTypes.string.isRequired,
};

export default Root;
