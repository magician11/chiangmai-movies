import React from 'react';
import { Alert, Glyphicon } from 'react-bootstrap';

export default () => (
  <div className="text-center">
    <Alert bsStyle="info">
      <Glyphicon glyph="info-sign" /> <strong>Movie Data Sources</strong>
      <p>Showtime data scraped from <a href="https://booking.sfcinemacity.com/visPrintShowTimes.aspx?visLang=1&visCinemaId=9936">SF Cinema City</a></p>
      <p>Movie detail data acquired from <a href="https://www.themoviedb.org/">The Movie DB</a></p>
      <p>All data is updated on every page load.</p>
    </Alert>
    <p><Glyphicon glyph="heart" /> webapp made by <a href="http://www.golightlyplus.com">Golightly+</a></p>
  </div>
);
