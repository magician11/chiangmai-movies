import React from 'react';
import { Glyphicon, Button } from 'react-bootstrap';

// rotten tomato icons
import certifiedFresh from '../icons/certified-fresh.png';
import fresh from '../icons/fresh.png';
import splat from '../icons/splat.png';

const MovieLinks = props => {
  const { movie } = props;

  let rottenTomatoIcon;
  if (movie.tomatoMeter >= 75) {
    rottenTomatoIcon = certifiedFresh;
  } else if (movie.tomatoMeter >= 60) {
    rottenTomatoIcon = fresh;
  } else {
    rottenTomatoIcon = splat;
  }

  let rtUrl;
  if (movie.tomatoMeter && movie.rottenTomatoesUrl) {
    rtUrl = (
      <div className="rotten-tomatoes-score">
        <a href={movie.rottenTomatoesUrl}>
          <img
            src={rottenTomatoIcon}
            alt={`Icon for rating of ${movie.tomatoMeter}`}
          />{' '}
          {movie.tomatoMeter}%
        </a>
      </div>
    );
  } else if (movie.rottenTomatoesUrl) {
    rtUrl = (
      <p>
        <a href={movie.rottenTomatoesUrl}>
          <Glyphicon glyph="link" /> Rotten Tomatoes
        </a>
      </p>
    );
  }

  return (
    <div className="movie-links">
      {rtUrl}
      {movie.trailer &&
        <Button>
          <a href={movie.trailer}>
            <Glyphicon glyph="facetime-video" /> View Trailer
          </a>
        </Button>}
    </div>
  );
};

export default MovieLinks;
