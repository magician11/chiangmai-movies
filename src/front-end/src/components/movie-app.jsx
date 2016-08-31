import React, { Component } from 'react';
import request from 'browser-request';
import { Form, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import MovieTable from './movie-table';
import styling from '../styles/movie-app.scss';

class MovieApp extends Component {
  constructor() {
    super();
    this.state = {
      movieData: null,
      targetDate: null,
      availableDates: [],
    };

    request('http://128.199.143.40:3000/maya-mall?language=E', (er, response, body) => {
      if (er) {
        throw er;
      }

      const movieData = JSON.parse(body);
      const availableDates = this.getUniqueDates(movieData);
      this.setState({ movieData, availableDates, targetDate: this.setTargetDate(0) });
    });

    this.handleDateChange = this.handleDateChange.bind(this);
  }

  getUniqueDates(movieData) {
    const dates = {};
    for (const movieName of Object.keys(movieData)) {
      for (const movieDate of Object.keys(movieData[movieName])) {
        dates[movieDate] = true;
      }
    }

    return Object.keys(dates);
  }

  setTargetDate(daysAhead) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysAhead);

    return targetDate;
  }

  handleDateChange(event) {
    this.setState({ targetDate: this.setTargetDate(parseInt(event.target.value, 10)) });
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
      content = (
        <div>
          <Form inline>
            <FormGroup controlId="formControlsSelect">
              <ControlLabel>Date</ControlLabel>
              {' '}
              <FormControl
                componentClass="select"
                placeholder="select"
                onChange={this.handleDateChange}
              >
                {this.state.availableDates
                  .map((date, index) => <option key={index} value={index}>{date}</option>)}
              </FormControl>
            </FormGroup>

          </Form>
          <br />
          <MovieTable movieData={movieData} targetDate={this.state.targetDate} />
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
