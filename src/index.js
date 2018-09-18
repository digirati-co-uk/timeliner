import './main.scss';
import React from 'react';
import { render } from 'react-dom';

import VariationsMainView from './components/VariationsMainView/VariationsMainView';
import DEMO_POINTS from './components/TimeMetadata/TimeMetadata.Demo';

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
    <VariationsMainView
      points={DEMO_POINTS}
      {...{
        volume: 70,
        isPlaying: true,
        currentTime: 30 * 1000,
        runTime: 60 * 1000,
        manifestLabel: 'Manifest label',
        manifestSummary: 'Manifest Summary',
      }}
    />
  </div>,
  document.getElementById('app')
);
