import React from 'react';
import { Grid, Row, Col, Badge, Panel, Image } from 'react-bootstrap';

const MovieListing = props => {
  const movieData = props.movieData;
  const movieShowings = [];
  movieData.forEach((movie) => {
    movie.showTimes.forEach((showTime) => {
      if (showTime.date.includes(` ${props.targetDate.getDate()} `)) {
        movieShowings.push(
          <Row className="show-grid" key={`${movie.title} - ${showTime.date}`}>
            <Col xs={12} md={4}>
              <Image src={movie.image} alt={movie.title} thumbnail responsive />
            </Col>
            <Col xs={12} md={8}>
              <h2>{movie.title} <Badge>{movie.score}</Badge></h2>
              <p>{movie.overview}</p>
              <Panel header="Show Times">
                {showTime.times}
              </Panel>
            </Col>
          </Row>
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

MovieListing.propTypes = {
  movieData: React.PropTypes.array.isRequired,
  targetDate: React.PropTypes.object.isRequired,
};

export default MovieListing;
