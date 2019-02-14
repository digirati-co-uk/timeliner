import './main.scss';
import React from 'react';
import { render } from 'react-dom';
import Root from './containers/Root/Root';
import configureStore from './store/main';
import * as qs from 'query-string';

const { resource, save, ...hash } = qs.parse(location.hash);

// Set the hash back
location.hash = qs.stringify({ resource, save, ...hash });

const { store, persistor } = configureStore(
  resource,
  typeof save === 'undefined'
);

render(
  <Root store={store} persistor={persistor} />,
  document.getElementById('app')
);
