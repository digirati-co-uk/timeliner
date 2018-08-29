import './main.scss';
import React from 'react';
import { render } from 'react-dom';

render(
  <div>
    <a
      className="documentation"
      href={
        process.env.NODE_ENV === 'production'
          ? '/docs'
          : 'http://localhost:5001'
      }
    >
      Go to docs
    </a>
    <h1>Timeliner</h1>
  </div>,
  document.getElementById('app')
);
