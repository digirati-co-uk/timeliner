import './main.scss';
import React from 'react';
import { render } from 'react-dom';
import Root from './containers/Root/Root';
import store from './store/main';
//import DEMO_POINTS from './components/TimeMetadata/TimeMetadata.Demo';

render(<Root store={store} />, document.getElementById('app'));
