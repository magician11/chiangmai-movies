import React from 'react';
import ReactDOM from 'react-dom';
import serviceWorker from 'file!./sw.js';

import MovieApp from './components/movie-app';

require('file!../manifest.json');

/* eslint-disable no-console */

require('bootstrap/dist/css/bootstrap.css');

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(serviceWorker).then((registration) => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch((err) => {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

ReactDOM.render(<MovieApp />, document.getElementById('app'));
