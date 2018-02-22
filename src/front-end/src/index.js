import React from 'react';
import ReactDOM from 'react-dom';

import MovieApp from './components/movie-app';

require('bootstrap/dist/css/bootstrap.css');
require('./styles/movie-app.css');

ReactDOM.render(<MovieApp />, document.getElementById('app'));
