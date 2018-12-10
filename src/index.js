import './main.scss';
import React from 'react';
import { render } from 'react-dom';
import Root from './containers/Root/Root';
import configureStore from './store/main';

const { store, persistor } = configureStore();

render(
  <Root store={store} persistor={persistor} />,
  document.getElementById('app')
);
