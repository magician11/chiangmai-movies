import React, { Component } from 'react';
import request from 'browser-request';

class MovieTimes extends Component {
  constructor() {
    super();
    this.state = {
    };

    // do the ajax calls here
    request('http://booking.sfcinemacity.com/visPrintShowTimes.aspx?visLang=1&visCinemaId=9936', (er, response, body) => {
      if (er) {
        throw er;
      }
      console.log(body);
    });
  }

  // fetch movies using https://www.npmjs.com/package/browser-request

  render() {
    return (
      <div>
        <h1>hello world</h1>
      </div>
    );
  }
}

export default MovieTimes;
