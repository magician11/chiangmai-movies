import React, { Component } from 'react';
import request from 'browser-request';
import MovieTable from './movie-table';

class MovieTimes extends Component {
  constructor() {
    super();
    this.state = {
      movieTimes: null,
      targetDate: null,
    };

    request('http://128.199.143.40:3000/maya-mall', (er, response, body) => {
      if (er) {
        throw er;
      }
      this.setState({ movieTimes: JSON.parse(body), targetDate: this.setTargetDate(1) });
    });
  }

  setTargetDate(daysAhead) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysAhead);

    return targetDate;
  }

  render() {
    const movieData = this.state.movieTimes;
    let content;

    if (!movieData) {
      content = <h1>loading</h1>;
    } else {
      content = (
        <div>
          <p>Movies for {this.state.targetDate.toDateString()}</p>
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

export default MovieTimes;
