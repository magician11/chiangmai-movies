import React from 'react';
import { Table } from 'react-bootstrap';

const Showtimes = (props) => {
  const { times } = props;

  const movieTimes = Object.keys(times).map((movieVariant) => {
    let movieType;
    switch (movieVariant) {
      case 'E': movieType = 'English'; break;
      case 'F': movieType = 'First Class Cinema'; break;
      case 'T': movieType = 'Thai'; break;
      case 'J': movieType = 'Japanese with Thai subtitles'; break;
      case 'T-E-SUB': movieType = 'Thai with English subtitles'; break;
      case 'E-ATMOS': movieType = 'English with Atmos surround sound'; break;
      default: movieType = movieVariant;
    }
    return <tr key={movieVariant}><td>{movieType}</td><td>{times[movieVariant]}</td></tr>;
  });

  return (
    <Table bordered condensed>
      <thead>
        <tr>
          <th>Language</th>
          <th>Showtimes</th>
        </tr>
      </thead>
      <tbody>
        {movieTimes}
      </tbody>
    </Table>
  );
};

Showtimes.propTypes = {
  times: React.PropTypes.objectOf(React.PropTypes.string),
};

export default Showtimes;
