import React from 'react';
import ReactDOM from 'react-dom';
import { Grid, Row, Col, Glyphicon, PageHeader } from 'react-bootstrap';
import MovieApp from './components/movie-app';

require('bootstrap/dist/css/bootstrap.css');

const root = document.createElement('div');
document.body.appendChild(root);

const basicInterface = (
  <Grid>
    <Row>
      <Col xs={12}>
        <PageHeader className="text-center">
          English Movies <small>@ Maya Mall in Chiang Mai, Thailand</small>
        </PageHeader>
        <MovieApp />
        <hr />
        <div className="text-center">
          <p><Glyphicon glyph="info-sign" /> Data scraped from <a href="https://booking.sfcinemacity.com/visPrintShowTimes.aspx?visLang=1&visCinemaId=9936">https://booking.sfcinemacity.com</a></p>
          <p><Glyphicon glyph="heart" /> webapp made by <a href="http://www.golightlyplus.com">Golightly+</a></p>
        </div>
      </Col>
    </Row>
  </Grid>
);

ReactDOM.render(basicInterface, root);
