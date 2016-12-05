import React from 'react';
import { Alert, Glyphicon } from 'react-bootstrap';

export default () => (
  <div className="text-center">
    <Alert bsStyle="info">
      <Glyphicon glyph="info-sign" /> <strong>Movie Data Sources</strong>
      <p>Showtime data scraped from <a href="https://booking.sfcinemacity.com/visPrintShowTimes.aspx?visLang=1&visCinemaId=9936">SF Cinema City</a></p>
      <p>Movie data from <a href="https://www.themoviedb.org/">The Movie DB</a> and <a href="http://www.omdbapi.com/">OMDb</a></p>
    </Alert>
    <p><Glyphicon glyph="heart" /> Created by <a href="http://www.golightlyplus.com">Golightly+</a></p>
  </div>
);
