import './main.scss';
import React from 'react';
import { render } from 'react-dom';
import Root from './containers/Root/Root';
import configureStore from './store/main';
import * as qs from 'query-string';

const { resource, save, callback, noFooter, noHeader, ...hash } = qs.parse(location.hash);

// Set the hash back
location.hash = qs.stringify({ resource, save, callback, noFooter, noHeader, ...hash });

const { store, persistor } = configureStore(
  resource,
  typeof save === 'undefined',
  callback
);

render(
  <Root
    store={store}
    persistor={persistor}
    callback={callback}
    hasResource={!!resource}
    resource={resource}
    noFooter={noFooter === 'true'}
    noHeader={noHeader === 'true'}
  />,
  document.getElementById('app')
);
