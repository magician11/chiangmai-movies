import React from 'react';
import { Table } from 'react-bootstrap';

const MovieTable = props => {
  const movieData = props.movieData;
  const movieTimes = [];
  for (const movieName of Object.keys(movieData)) {
    for (const movieDate of Object.keys(movieData[movieName])) {
      if (movieDate.includes(` ${props.targetDate.getDate()} `)) {
        movieTimes.push(
          <tr key={`${movieName}${movieDate}`}>
            <td>{movieName}</td><td>{movieData[movieName][movieDate]}</td>
          </tr>
        );
      }
    }
  }

  return (
    <Table striped bordered condensed hover>
      <thead>
        <tr>
          <th>Movie Title</th>
          <th>Show Times</th>
        </tr>
      </thead>
      <tbody>
        {movieTimes}
      </tbody>
    </Table>
  );
};

MovieTable.propTypes = {
  movieData: React.PropTypes.object.isRequired,
  targetDate: React.PropTypes.object.isRequired,
};

export default MovieTable;
