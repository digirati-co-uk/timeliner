import './main.scss';
import React from 'react';
import { render } from 'react-dom';
import Root from './containers/Root/Root';
import configureStore from './store/main';

render(<Root store={configureStore()} />, document.getElementById('app'));
