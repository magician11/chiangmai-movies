import React from 'react';
import { Table } from 'react-bootstrap';

const MovieTable = props => {
  const movieData = props.movieData;
  const movieShowings = [];
  movieData.forEach((movie) => {
    movie.showTimes.forEach((showTime) => {
      if (showTime.date.includes(` ${props.targetDate.getDate()} `)) {
        movieShowings.push(
          <tr key={`${movie.title} - ${showTime.date}`}>
            <td>{movie.title}</td>
            <td>{movie.plot}</td>
            <td>{movie.actors}</td>
            <td>{showTime.times}</td>
            <td>{movie.rottenTomatoesScore}%</td>
          </tr>
        );
      }
    });
  });

  return (
    <Table striped bordered condensed hover>
      <thead>
        <tr>
          <th>Movie Title</th>
          <th>Description</th>
          <th>Cast</th>
          <th>Show Times</th>
          <th>Rotten Tomatoes Score</th>
        </tr>
      </thead>
      <tbody>
        {movieShowings}
      </tbody>
    </Table>
  );
};

MovieTable.propTypes = {
  movieData: React.PropTypes.array.isRequired,
  targetDate: React.PropTypes.object.isRequired,
};

export default MovieTable;
