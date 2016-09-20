import React from 'react';
import { Table, Image, Glyphicon } from 'react-bootstrap';
import styling from '../styles/movie-app.scss';

const MovieListing = props => {
  const movieData = props.movieData;
  const movieShowings = [];
  movieData.forEach((movie) => {
    movie.showTimes.forEach((showTime) => {
      if (showTime.date === props.targetDate) {
        movieShowings.push(
          <tr key={`${movie.title} - ${showTime.date}`}>
            <td><Image src={movie.image} alt={movie.title} thumbnail responsive /></td>
            <td>{movie.title}</td>
            <td>{movie.score}</td>
            <td>{showTime.times}</td>
            <td>{movie.overview}</td>
          </tr>
        );
      }
    });
  });

  return (
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
  );
};

MovieListing.propTypes = {
  movieData: React.PropTypes.array.isRequired,
  targetDate: React.PropTypes.string.isRequired,
};

export default MovieListing;
