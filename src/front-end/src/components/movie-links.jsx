import React from 'react';
import { Glyphicon } from 'react-bootstrap';
import styling from '../styles/movie-app.css';

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

  let imdbUrl;
  if (movie.imdbRating && movie.imdbUrl) {
    imdbUrl = (
      <p>
        <a href={movie.imdbUrl}>
          <Glyphicon glyph="star" /> {movie.imdbRating} / 10 (IMDb)
        </a>
      </p>
    );
  } else if (movie.imdbUrl) {
    imdbUrl = (
      <p>
        <a href={movie.imdbUrl}>
          <Glyphicon glyph="link" /> IMDb
        </a>
      </p>
    );
  }

  return (
    <div className={styling['movie-links']}>
      { rtUrl }
      { imdbUrl }
      { movie.trailer &&
        <p>
          <a href={movie.trailer}><Glyphicon glyph="facetime-video" /> View Trailer</a>
        </p>
      }
    </div>
  );
};

MovieLinks.propTypes = {
  movie: React.PropTypes.shape({
    actors: React.PropTypes.string.isRequired,
    imdbRating: React.PropTypes.string.isRequired,
    imdbUrl: React.PropTypes.string.isRequired,
    overview: React.PropTypes.string.isRequired,
    posterImage: React.PropTypes.string.isRequired,
    rating: React.PropTypes.string.isRequired,
    rottenTomatoesUrl: React.PropTypes.string.isRequired,
    runtime: React.PropTypes.string.isRequired,
    showTimes: React.PropTypes.object.isRequired,
    title: React.PropTypes.string.isRequired,
    tomatoConsensus: React.PropTypes.string.isRequired,
    tomatoMeter: React.PropTypes.string.isRequired,
    trailer: React.PropTypes.string.isRequired,
  }).isRequired,
};

export default MovieLinks;
