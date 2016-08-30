import React from 'react';
import ReactDOM from 'react-dom';
import MovieTimes from './components/movie-times';

require('bootstrap/dist/css/bootstrap.css');

const root = document.createElement('div');
document.body.appendChild(root);
ReactDOM.render(<MovieTimes />, root);
