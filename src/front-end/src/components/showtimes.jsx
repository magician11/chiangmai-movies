import React from 'react';
import { Table } from 'react-bootstrap';

const Showtimes = props => {
  const { showtimes } = props;

  const movieTimes = showtimes.map(cinema => {
    let language;
    switch (cinema.language) {
      case 'ENG':
        language = 'English';
        break;
      case 'TH':
        language = 'Thai';
        break;
      default:
        language = cinema.language;
    }
    return (
      <tr key={`${cinema.cinemaNumber} - ${language}`}>
        <td>
          {cinema.cinemaNumber}
        </td>
        <td>
          {language}
        </td>
        <td>
          {cinema.times.replace(',', ', ')}
        </td>
      </tr>
    );
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
