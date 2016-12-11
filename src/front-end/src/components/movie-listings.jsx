/* eslint-disable max-len */

import React from 'react';
import { Grid, Row, Col, Image, Button, Glyphicon, Label, Tabs, Tab } from 'react-bootstrap';
import Showtimes from './showtimes';

const MovieListings = (props) => {
  const { movieData, targetDate } = props;
  const movieShowings = [];

  movieData.forEach((movie) => {
    Object.keys(movie.showTimes).forEach((movieDate) => {
      if (movieDate === targetDate) {
        const movieImage = (movie.posterImage) ? movie.posterImage : 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBoZWlnaHQ9IjMwMHB4IiB3aWR0aD0iMzAwcHgiIHZlcnNpb249IjEuMCIgdmlld0JveD0iLTMwMCAtMzAwIDYwMCA2MDAiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Y2lyY2xlIHN0cm9rZT0iI0FBQSIgc3Ryb2tlLXdpZHRoPSIxMCIgcj0iMjgwIiBmaWxsPSIjRkZGIi8+Cjx0ZXh0IHN0eWxlPSJsZXR0ZXItc3BhY2luZzoxO3RleHQtYW5jaG9yOm1pZGRsZTt0ZXh0LWFsaWduOmNlbnRlcjtzdHJva2Utb3BhY2l0eTouNTtzdHJva2U6IzAwMDtzdHJva2Utd2lkdGg6MjtmaWxsOiM0NDQ7Zm9udC1zaXplOjM2MHB4O2ZvbnQtZmFtaWx5OkJpdHN0cmVhbSBWZXJhIFNhbnMsTGliZXJhdGlvbiBTYW5zLCBBcmlhbCwgc2Fucy1zZXJpZjtsaW5lLWhlaWdodDoxMjUlO3dyaXRpbmctbW9kZTpsci10YjsiIHRyYW5zZm9ybT0ic2NhbGUoLjIpIj4KPHRzcGFuIHk9Ii00MCIgeD0iOCI+Tk8gSU1BR0U8L3RzcGFuPgo8dHNwYW4geT0iNDAwIiB4PSI4Ij5BVkFJTEFCTEU8L3RzcGFuPgo8L3RleHQ+Cjwvc3ZnPg==';
        const showTimes = <Showtimes times={movie.showTimes[movieDate]} />;

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

        movieShowings.push(
          <Row key={movie.title}>
            <Col xs={4}>
              <Image src={movieImage} alt={movie.title} thumbnail responsive />
            </Col>
            <Col xs={8}>
              <div className="hidden-xs">
                <h2>
                  {movie.title} { movie.tomatoMeter &&
                    <small><Label bsStyle="info">{movie.tomatoMeter}%</Label></small>
                  }
                </h2>
                <br />
                {movie.trailer && <Button bsStyle="primary" href={movie.trailer}>
                  <Glyphicon glyph="facetime-video" /> View Trailer
                </Button>}
                <br />
                <br />
                <Tabs defaultActiveKey={2} id="movie-details">
                  <Tab eventKey={1} title="Showtimes">
                    {showTimes}
                  </Tab>
                  <Tab eventKey={2} title="Movie Details">
                    { movie.overview &&
                      <div>
                        <h4>Synopsis</h4>
                        <p>{movie.overview}</p>
                      </div>
                    }
                    { movie.actors &&
                      <div>
                        <h4>Actors</h4>
                        <p>{movie.actors}</p>
                      </div>
                    }
                    { movie.runtime &&
                      <div>
                        <h4>Runtime</h4>
                        <p>{movie.runtime}</p>
                      </div>
                    }
                    { movie.rating &&
                      <div>
                        <h4>Rated</h4>
                        <p>{movie.rating}</p>
                      </div>
                    }
                  </Tab>
                  <Tab eventKey={3} title="Reviews">
                    <br />
                    { movie.tomatoConsensus &&
                      <blockquote>
                        <p>{movie.tomatoConsensus}</p>
                        <footer>
                          <cite title="Source Title">Rotten Tomatoes</cite>
                        </footer>
                      </blockquote>
                    }
                    { rtUrl }
                    { imdbUrl }
                  </Tab>
                </Tabs>
              </div>
              <div className="visible-xs">
                <h4>{ movie.title }</h4>
                { rtUrl }
                { imdbUrl }
                {movie.trailer &&
                  <p>
                    <a href={movie.trailer}><Glyphicon glyph="facetime-video" /> View Trailer</a>
                  </p>
                }
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
