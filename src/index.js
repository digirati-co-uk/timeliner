import './main.scss';
import React from 'react';
import { render } from 'react-dom';
import Root from './containers/Root/Root';
import store from './store/main';
//import DEMO_POINTS from './components/TimeMetadata/TimeMetadata.Demo';

render(
  <div>
    {/* <a
      className="documentation"
      href={
        process.env.NODE_ENV === 'production'
          ? '/docs'
          : 'http://localhost:5001'
      }
    >
      Go to docs
    </a> */}
    <Root store={store} />
  </div>,
  document.getElementById('app')
);
