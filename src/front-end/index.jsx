import React from 'react';
import ReactDOM from 'react-dom';
import { Grid, Row, Col, Glyphicon } from 'react-bootstrap';
import MovieTimes from './components/movie-times';

require('bootstrap/dist/css/bootstrap.css');

const root = document.createElement('div');
document.body.appendChild(root);

const basicInterface = (
  <Grid>
    <Row>
      <Col xs={12}>
        <div className="text-center">
          <h1><Glyphicon glyph="film" /> Movie times</h1>
          <h2>
            <Glyphicon glyph="star" /> Maya Mall in Chiang Mai, Thailand <Glyphicon glyph="star" />
          </h2>
        </div>
        <hr />
        <MovieTimes />
      </Col>
    </Row>
  </Grid>
);

ReactDOM.render(basicInterface, root);
