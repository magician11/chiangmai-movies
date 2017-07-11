import React from 'react';
import { Table } from 'react-bootstrap';

const Showtimes = props => {
  const { showtimes } = props;

  const movieTimes = Object.keys(showtimes).map((cinema) => {
    let language;
    switch (showtimes[cinema].language) {
      case 'ENG': language = 'English'; break;
      case 'TH': language = 'Thai'; break;
      default: language = showtimes[cinema].language;
    }
    return <tr key={cinema}><td>{cinema}</td><td>{language}</td><td>{showtimes[cinema].times}</td></tr>;
  });

  return (
    <Table bordered condensed>
      <thead>
        <tr>
          <th>Cinema</th>
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

export default Showtimes;
