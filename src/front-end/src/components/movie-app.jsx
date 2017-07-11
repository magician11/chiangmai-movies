import React, { Component } from 'react';
import firebase from 'firebase';
import ReactGA from 'react-ga';
import {
  Grid,
  Col,
  Row,
  Form,
  Panel,
  Glyphicon,
  FormGroup,
  FormControl,
  ControlLabel
} from 'react-bootstrap';
import MovieListings from './movie-listings';
import Header from './header';
import Footer from './footer';

class MovieApp extends Component {
  /*
  Grab the showtimes for a movie, find the unique dates,
  and then return those dates sorted by date.

  When sorting, if we're in December and we see a January date, assume it's
  for the next year.
  */
  // static getUniqueDates(movieData) {
  //   const dates = {};
  //   movieData.forEach(movie => {
  //     Object.keys(movie.showTimes).forEach(movieDate => {
  //       dates[movieDate] = true;
  //     });
  //   });
  //
  //   const currentYear = new Date().getFullYear();
  //   const currentMonth = new Date().getMonth();
  //
  //   // add a year so we can sort across years
  //   const addYear = date => {
  //     const month = date.match(/\w{3}$/)[0];
  //     if (currentMonth === 11 && month === 'Jan') {
  //       return `${date} ${currentYear + 1}`;
  //     }
  //
  //     return `${date} ${currentYear}`;
  //   };

  //   return Object.keys(dates).sort((date1, date2) => {
  //     const dateObj1 = new Date(addYear(date1));
  //     const dateObj2 = new Date(addYear(date2));
  //     return dateObj1 > dateObj2 ? 1 : -1;
  //   });
  // }

  constructor() {
    super();
    this.state = {
      movieData: null,
      targetDate: 'loading...',
      availableDates: []
    };

    // grab data from firebase
    const config = {
      apiKey: 'AIzaSyC_Bv5Apio1PBrO048figZ6i3B_nkccoMw',
      authDomain: 'movies-387bf.firebaseapp.com',
      databaseURL: 'https://movies-387bf.firebaseio.com',
      projectId: 'movies-387bf',
      storageBucket: 'movies-387bf.appspot.com',
      messagingSenderId: '208320671675'
    };
    firebase.initializeApp(config);
    const database = firebase.database();
    database.ref('/').once('value').then(dataSnapshot => {
      const movieData = dataSnapshot.val();
      console.log(movieData);

      const availableDates = Object.keys(
        movieData['movie-theatres'].chiangmai['9936']
      );
      // console.log(availableDates);
      // eslint-disable-next-line max-len
      // movieData.sort((m1, m2) => {
      //   /*
      //   parseInt() on an empty string is NaN.
      //   And any number is not greater than NaN. e.g. 75 > NaN is false.
      //   So need to check for empty string otherwise sorting doesn't work.
      //   */
      //   const rating1 = m1.tomatoMeter ? parseInt(m1.tomatoMeter, 10) : 0;
      //   const rating2 = m2.tomatoMeter ? parseInt(m2.tomatoMeter, 10) : 0;
      //   return rating1 < rating2 ? 1 : -1;
      // });

      this.setState({
        movieData,
        availableDates,
        targetDate: availableDates[0]
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
        <div className="sk-cube-grid">
          <div className="sk-cube sk-cube1" />
          <div className="sk-cube sk-cube2" />
          <div className="sk-cube sk-cube3" />
          <div className="sk-cube sk-cube4" />
          <div className="sk-cube sk-cube5" />
          <div className="sk-cube sk-cube6" />
          <div className="sk-cube sk-cube7" />
          <div className="sk-cube sk-cube8" />
          <div className="sk-cube sk-cube9" />
        </div>
      );
    } else {
      content = (
        <div>
          <Panel>
            <Row>
              <Col xs={6} sm={3}>
                <h2>MAYA Mall</h2>
              </Col>
              <Col className="text-center" sm={6} xsHidden>
                <h1>Chiang Mai Movies</h1>
                <div className="social-media-buttons">
                  <a
                    href="https://twitter.com/share"
                    className="twitter-share-button"
                    data-show-count="false"
                  >
                    Tweet
                  </a>
                  <div
                    className="fb-like"
                    data-href="https://chiangmaimovies.com"
                    data-layout="button_count"
                    data-action="like"
                    data-size="small"
                    data-show-faces="true"
                    data-share="true"
                  />
                </div>
              </Col>
              <Col xs={6} sm={3} className="text-right">
                <p>
                  Corner of Huay Kaew Rd and Super Highway 11. Across from
                  Nimmanhaemin.
                </p>
                <p>
                  <Glyphicon glyph="map-marker" />{' '}
                  <a href="https://goo.gl/maps/MJ2KMy2hvnG2">cinema location</a>
                </p>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <Form inline>
                  <FormGroup controlId="formControlsSelect">
                    <ControlLabel>Dates</ControlLabel>{' '}
                    <FormControl
                      componentClass="select"
                      placeholder="select"
                      onChange={this.handleDateChange}
                    >
                      {this.state.availableDates.map(date =>
                        <option key={date} value={date}>
                          {date}
                        </option>
                      )}
                    </FormControl>
                  </FormGroup>
                </Form>
                <Col
                  xs={12}
                  className="social-media-buttons"
                  lgHidden
                  mdHidden
                  smHidden
                >
                  <a
                    href="https://twitter.com/share"
                    className="twitter-share-button"
                    data-show-count="false"
                  >
                    Tweet
                  </a>
                  <div
                    className="fb-like"
                    data-href="https://chiangmaimovies.com"
                    data-layout="button_count"
                    data-action="like"
                    data-size="small"
                    data-show-faces="true"
                    data-share="true"
                  />
                </Col>
              </Col>
            </Row>
          </Panel>
          <MovieListings
            movieData={movieData}
            targetDate={this.state.targetDate}
          />
        </div>
      );
    }

    return (
      <div>
        <Header date={this.state.targetDate} />
        <Grid className="movie-app-container">
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
