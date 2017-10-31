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

    let cinemaNumber;
    switch (parseInt(cinema.cinemaNumber, 10)) {
      case 10:
        cinemaNumber = `${cinema.cinemaNumber} (First Class Cinema)`;
        break;
      case 2:
        cinemaNumber = `${cinema.cinemaNumber} (Dolby Atmos)`;
        break;
      default:
        cinemaNumber = cinema.cinemaNumber;
    }

    return (
      <tr key={`${cinemaNumber} - ${language}`}>
        <td>{cinemaNumber}</td>
        <td>{language}</td>
        <td>{cinema.times.replace(/,/g, ', ')}</td>
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
      <tbody>{movieTimes}</tbody>
    </Table>
  );
};

export default Showtimes;
