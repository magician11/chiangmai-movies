import React from 'react';
import { Table } from 'react-bootstrap';
// import styling from '../styles/movie-app.scss';

const Showtimes = (props) => {
  const { times } = props;

  const movieTimes = Object.keys(times).map((movieVariant) => {
    let movieType;
    switch (movieVariant) {
      case 'E': movieType = 'English'; break;
      case 'F': movieType = 'First Class Cinema'; break;
      case 'T': movieType = 'Thai'; break;
      case 'J': movieType = 'Japanese'; break;
      case 'T/E.SUB': movieType = 'Thai with English subtitles'; break;
      case 'E/ATMOS': movieType = 'English with Atmos surround sound'; break;
      default: movieType = movieVariant;
    }
    return <tr><td>{movieType}</td><td>{times[movieVariant]}</td></tr>;
  });

  return (
    <Table bordered condensed>
      <thead>
        <tr>
          <th>Movie Type</th>
          <th>Times</th>
        </tr>
      </thead>
      <tbody>
        {movieTimes}
      </tbody>
    </Table>
  );
};

Showtimes.propTypes = {
  times: React.PropTypes.shape({
    movieVariant: React.PropTypes.string.isRequired,
  }),
};

export default Showtimes;
