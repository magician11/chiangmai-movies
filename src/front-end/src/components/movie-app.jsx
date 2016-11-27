import React, { Component } from 'react';
import request from 'browser-request';
import { Form, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import MovieListings from './movie-listings';
import styling from '../styles/movie-app.scss';

class MovieApp extends Component {
  static getUniqueDates(movieData) {
    const dates = {};
    movieData.forEach((movie) => {
      Object.keys(movie.showTimes).forEach((movieDate) => {
        dates[movieDate] = true;
      });
    });
    return Object.keys(dates);
  }

  constructor() {
    super();
    this.state = {
      movieData: null,
      targetDate: null,
      availableDates: [],
    };

    request('http://128.199.143.40:3000/maya-mall', (er, response, body) => {
      if (er) {
        throw er;
      }

      const movieData = JSON.parse(body);
      const availableDates = MovieApp.getUniqueDates(movieData);
      this.setState({ movieData, availableDates, targetDate: availableDates[0] });
    });

    this.handleDateChange = this.handleDateChange.bind(this);
  }

  handleDateChange(event) {
    this.setState({ targetDate: event.target.value });
  }

  render() {
    const movieData = this.state.movieData;
    let content;

    if (!movieData) {
      content = (
        <div className={styling.spinner}>
          <div className={styling['double-bounce1']} />
          <div className={styling['double-bounce2']} />
        </div>
      );
    } else {
      content = (<div>
        <Form inline>
          <FormGroup controlId="formControlsSelect">
            <ControlLabel>Date</ControlLabel>
            {' '}
            <FormControl
              componentClass="select"
              placeholder="select"
              onChange={this.handleDateChange}
            >
              {this.state.availableDates.map(
                date => <option key={date} value={date}>{date}</option>,
              )}
            </FormControl>
          </FormGroup>
        </Form>
        <br />
        <MovieListings movieData={movieData} targetDate={this.state.targetDate} />
      </div>
      );
    }

    return (
      <div>
        {content}
      </div>
    );
  }
}

export default MovieApp;
