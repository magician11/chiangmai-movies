import React from 'react';
import { Grid, Row, Col, Image, Button, Glyphicon, Label } from 'react-bootstrap';
import styling from '../styles/movie-app.scss';
import Showtimes from './showtimes';

const MovieListings = (props) => {
  const { movieData, targetDate } = props;
  const movieShowings = [];

  movieData.forEach((movie) => {
    Object.keys(movie.showTimes).forEach((movieDate) => {
      if (movieDate === targetDate) {
        const movieImage = (movie.image) ? movie.image : 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBoZWlnaHQ9IjMwMHB4IiB3aWR0aD0iMzAwcHgiIHZlcnNpb249IjEuMCIgdmlld0JveD0iLTMwMCAtMzAwIDYwMCA2MDAiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Y2lyY2xlIHN0cm9rZT0iI0FBQSIgc3Ryb2tlLXdpZHRoPSIxMCIgcj0iMjgwIiBmaWxsPSIjRkZGIi8+Cjx0ZXh0IHN0eWxlPSJsZXR0ZXItc3BhY2luZzoxO3RleHQtYW5jaG9yOm1pZGRsZTt0ZXh0LWFsaWduOmNlbnRlcjtzdHJva2Utb3BhY2l0eTouNTtzdHJva2U6IzAwMDtzdHJva2Utd2lkdGg6MjtmaWxsOiM0NDQ7Zm9udC1zaXplOjM2MHB4O2ZvbnQtZmFtaWx5OkJpdHN0cmVhbSBWZXJhIFNhbnMsTGliZXJhdGlvbiBTYW5zLCBBcmlhbCwgc2Fucy1zZXJpZjtsaW5lLWhlaWdodDoxMjUlO3dyaXRpbmctbW9kZTpsci10YjsiIHRyYW5zZm9ybT0ic2NhbGUoLjIpIj4KPHRzcGFuIHk9Ii00MCIgeD0iOCI+Tk8gSU1BR0U8L3RzcGFuPgo8dHNwYW4geT0iNDAwIiB4PSI4Ij5BVkFJTEFCTEU8L3RzcGFuPgo8L3RleHQ+Cjwvc3ZnPg==';

        const showTimes = <Showtimes times={movie.showTimes[movieDate]} />;

        movieShowings.push(
          <Row key={movie.title} className={styling.movie}>
            <Col xs={4}>
              <Image src={movieImage} alt={movie.title} thumbnail responsive />
            </Col>
            <Col xs={8}>
              <h2 className="hidden-xs">
                {movie.title} <small><Label bsStyle="info">{movie.rating} / 10</Label></small>
              </h2>
              <div className="visible-xs">
                <h4>{ movie.title }</h4>
                <h5><Glyphicon glyph="star" /> {movie.rating} / 10</h5>
                <p>{movie.youTubeVideoId && <a href={`https://www.youtube.com/watch?v=${movie.youTubeVideoId}`}>
                  <Glyphicon glyph="facetime-video" /> View Trailer
                </a>}</p>
              </div>
              <div className="hidden-xs">
                <h3>Overview</h3>
                <p>{movie.overview}</p>
              </div>
              <div className="hidden-xs">
                <h3>Showtimes</h3>
                {showTimes}
                {movie.youTubeVideoId && <Button bsStyle="primary" href={`https://www.youtube.com/watch?v=${movie.youTubeVideoId}`}>
                  <Glyphicon glyph="facetime-video" /> View Trailer on YouTube
                </Button>}
              </div>
            </Col>
          </Row>,
          <Row key={`${movie.title} - timesAndTrailer`} className="visible-xs">
            <Col xs={12}>
              <div><br />{showTimes}</div>
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
