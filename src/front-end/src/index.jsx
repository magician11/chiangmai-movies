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
          Movie Times <small>Maya Mall in Chiang Mai, Thailand</small>
        </PageHeader>
        <MovieApp />
        <hr />
        <p className="text-center"><Glyphicon glyph="film" /> webapp made by <a href="http://www.golightlyplus.com">Golightly+</a></p>
      </Col>
    </Row>
  </Grid>
);

ReactDOM.render(basicInterface, root);
