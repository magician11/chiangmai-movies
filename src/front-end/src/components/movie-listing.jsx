import React from 'react';
import { Grid, Row, Col, Image, Button, Glyphicon } from 'react-bootstrap';
import styling from '../styles/movie-app.scss';
/*
TODO
Add trailers. Currently a bug on YouTube's end
http://stackoverflow.com/questions/40622204/uncaught-referenceerror-ytcfg-is-not-defined

<div className="embed-responsive embed-responsive-16by9">
<iframe src={`https://www.youtube.com/embed/${movie.trailer}?rel=0&amp;controls=0&amp;showinfo=0`}></iframe>
</div>
*/

const MovieListings = (props) => {
  const { movieData, targetDate } = props;
  const movieShowings = [];
  movieData.forEach((movie) => {
    movie.showTimes.forEach((showTime) => {
      if (showTime.date === targetDate) {
        movieShowings.push(
          <Row key={`${movie.title} - ${showTime.date}`} className={styling.movie}>
            <Col xs={12} md={4}>
              <Image src={movie.image} alt={movie.title} thumbnail responsive />
            </Col>
            <Col xs={12} md={8}>
              <h2>{movie.title}</h2>
              <p>{movie.overview}</p>
              <p><strong>Show times:</strong> {showTime.times}</p>
              <p><strong>Rating:</strong> {movie.score}</p>
              <Button bsStyle="primary" href={`https://www.youtube.com/watch?v=${movie.trailer}`}>
                <Glyphicon glyph="facetime-video" /> View Trailer
              </Button>
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
