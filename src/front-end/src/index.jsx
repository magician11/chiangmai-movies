import React from 'react';
import ReactDOM from 'react-dom';
import { Grid, Row, Col, Glyphicon, Navbar, Alert } from 'react-bootstrap';
import MovieApp from './components/movie-app';
import styling from './styles/movie-app.scss';

require('bootstrap/dist/css/bootstrap.css');

// const root = document.createElement('div');
// document.body.appendChild(root);

const basicInterface = (
  <div>
    <Navbar fixedTop>
      <Navbar.Header>
        <Navbar.Brand>
          Movies
        </Navbar.Brand>
        <Navbar.Text>
          Maya Mall, Chiang Mai, Thailand
        </Navbar.Text>
      </Navbar.Header>
    </Navbar>
    <Grid className={styling['movie-app-container']}>
      <Row>
        <Col xs={12}>
          <MovieApp />
          <div className="text-center">
            <Alert bsStyle="info">
              <Glyphicon glyph="info-sign" /> <strong>Movie Data Sources</strong>
              <p>Showtime data scraped from <a href="https://booking.sfcinemacity.com/visPrintShowTimes.aspx?visLang=1&visCinemaId=9936">SF Cinema City</a></p>
              <p>Movie detail data acquired from <a href="https://www.themoviedb.org/">The Movie DB</a></p>
            </Alert>
            <p><Glyphicon glyph="heart" /> webapp made by <a href="http://www.golightlyplus.com">Golightly+</a></p>
          </div>
        </Col>
      </Row>
    </Grid>
  </div>
);

ReactDOM.render(basicInterface, document.getElementById('app'));
