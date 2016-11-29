import React, { Component } from 'react';
import request from 'browser-request';
import ReactGA from 'react-ga';
import { Grid, Col, Row, Form, Panel, Glyphicon, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import MovieListings from './movie-listings';
import Header from './header';
import Footer from './footer';
import styling from '../styles/movie-app.css';

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
      targetDate: 'loading...',
      availableDates: [],
    };

    request('http://128.199.143.40:3000/maya-mall', (er, response, body) => {
      if (er) {
        throw er;
      }

      const movieData = JSON.parse(body);
      const availableDates = MovieApp.getUniqueDates(movieData);
      // eslint-disable-next-line max-len
      const movieDataSortedByRating = movieData.sort((m1, m2) => ((m1.rating > m2.rating) ? -1 : 1));
      this.setState({
        movieData: movieDataSortedByRating,
        availableDates,
        targetDate: availableDates[0],
      });
    });

    // track app views with Google Analytics
    ReactGA.initialize('UA-63340534-3');
    ReactGA.pageview(window.location.pathname);

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
        <Panel>
          <Row>
            <Col xs={6} sm={3}>
              <h2>MAYA Mall</h2>
            </Col>
            <Col className="text-center" sm={6} xsHidden>
              <h1>Chiang Mai Movies</h1>
            </Col>
            <Col xs={6} sm={3} className="text-right">
              <p>Corner of Huay Kaew Rd and Super Highway 11. Across from Nimmanhaemin.</p>
              <p><Glyphicon glyph="map-marker" /> <a href="https://goo.gl/maps/MJ2KMy2hvnG2">cinema location</a></p>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <Form inline>
                <FormGroup controlId="formControlsSelect">
                  <ControlLabel>Dates</ControlLabel>
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
            </Col>
          </Row>
        </Panel>
        <br />
        <MovieListings movieData={movieData} targetDate={this.state.targetDate} />
      </div>
      );
    }

    return (
      <div>
        <Header date={this.state.targetDate} />
        <Grid className={styling['movie-app-container']}>
          <Row>
            <Col xs={12}>
              {content}
              <Footer />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default MovieApp;
