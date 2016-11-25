import React from 'react';
import { Grid, Row, Col, Image } from 'react-bootstrap';
// import styling from '../styles/movie-app.scss';

const MovieListings = (props) => {
  const { movieData, targetDate } = props;
  const movieShowings = [];
  movieData.forEach((movie) => {
    movie.showTimes.forEach((showTime) => {
      if (showTime.date === targetDate) {
        movieShowings.push(
          <Row key={`${movie.title} - ${showTime.date}`}>
            <Col xs={12} md={4}>
              <Image src={movie.image} alt={movie.title} thumbnail responsive />
            </Col>
            <Col xs={12} md={8}>
              <h2>{movie.title}</h2>
              <p>{movie.overview}</p>
              <p><strong>Show times:</strong> {showTime.times}</p>
              <p><strong>Rating:</strong> {movie.score}</p>
            </Col>
          </Row>,
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

/*
<Table bordered condensed>
<thead>
<tr>
<th className={styling.image}>Image</th>
<th className={styling.title}>Title</th>
<th className={styling.rating}>Rating / 10 <Glyphicon glyph="star" /></th>
<th className={styling.showtimes}>Showtimes</th>
<th className={styling.overview}>Overview</th>
</tr>
</thead>
<tbody>
{movieShowings}
</tbody>
</Table>

<td></td>
<td></td>
<td></td>
<td></td>
*/
