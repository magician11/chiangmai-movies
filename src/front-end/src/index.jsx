import React from 'react';
import ReactDOM from 'react-dom';
import MovieApp from './components/movie-app';
import serviceWorker from 'file!./sw.js';

/* eslint-disable no-console */

require('bootstrap/dist/css/bootstrap.css');

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(serviceWorker).then((registration) => {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch((err) => {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

ReactDOM.render(<MovieApp />, document.getElementById('app'));
