import React from 'react';
import { Grid, Row, Col, Image, Button, Glyphicon } from 'react-bootstrap';
import styling from '../styles/movie-app.scss';
import Showtimes from './showtimes';

const MovieListings = (props) => {
  const { movieData, targetDate } = props;
  const movieShowings = [];
  movieData.forEach((movie) => {
    Object.keys(movie.showTimes).forEach((movieDate) => {
      if (movieDate === targetDate) {
        movieShowings.push(
          <Row key={movie.title} className={styling.movie}>
            <Col xs={12} md={4}>
              <Image src={movie.image} alt={movie.title} thumbnail responsive />
            </Col>
            <Col xs={12} md={8}>
              <h2>{movie.title}</h2>
              <h3>Overview</h3>
              <p>{movie.overview}</p>
              <h3>Showtimes</h3>
              <Showtimes times={movie.showTimes[movieDate]} />
              <h3>Rating</h3>
              <p>{movie.score} / 10</p>
              {movie.youTubeVideoId && <Button bsStyle="primary" href={`https://www.youtube.com/watch?v=${movie.youTubeVideoId}`}>
                <Glyphicon glyph="facetime-video" /> View Trailer on YouTube
              </Button> }
            </Col>
          </Row>,
          <Row key={`${movie.title} - hr`}><Col xs={12}><hr /></Col></Row>,
        );
      }
    });
  });

  return (
    <Grid>
      {movieShowings}
    </Grid>
  );
};

MovieListings.propTypes = {
  movieData: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  targetDate: React.PropTypes.string.isRequired,
};

export default MovieListings;
