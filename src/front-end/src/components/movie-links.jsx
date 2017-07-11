import React from 'react';
import { Glyphicon, Button } from 'react-bootstrap';

const MovieLinks = (props) => {
  const { movie } = props;

  let rtUrl;
  if (movie.tomatoMeter && movie.rottenTomatoesUrl) {
    rtUrl = (
      <p>
        <a href={movie.rottenTomatoesUrl}>
          <Glyphicon glyph="star" /> {movie.tomatoMeter}% (Rotten Tomatoes)
        </a>
      </p>
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
    <div className='movie-links'>
      { rtUrl }
      { movie.trailer &&
        <Button>
          <a href={movie.trailer}><Glyphicon glyph="facetime-video" /> View Trailer</a>
        </Button>
      }
    </div>
  );
};

export default MovieLinks;
