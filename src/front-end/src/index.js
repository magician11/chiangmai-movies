import React from 'react';
import ReactDOM from 'react-dom';

import MovieApp from './components/movie-app';
import ErrorBoundary from './components/ErrorBoundary';

require('bootstrap/dist/css/bootstrap.css');
require('./styles/movie-app.css');

ReactDOM.render(
  <ErrorBoundary>
    <MovieApp />
  </ErrorBoundary>,
  document.getElementById('app')
);
