/*
This is all the movie data in the tabs.
*/

import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import Showtimes from './showtimes';

const MovieDetails = props => {
  const { movie, sfcinemaData, defaultTab } = props;
  const showTimes = <Showtimes showtimes={sfcinemaData.cinemas} />;

  let review;
  if (movie.tomatoConsensus) {
    review = (
      <div>
        <p>
          <em>
            &quot;{movie.tomatoConsensus}&quot;
          </em>
        </p>
        <p className="pull-right">
          &mdash; Critics Consensus on Rotten Tomatoes
        </p>
      </div>
    );
  } else {
    review = <p>No reviews currently available.</p>;
  }

  return (
    <Tabs
      defaultActiveKey={defaultTab}
      id="movie-details"
      className="movie-details"
    >
      <Tab eventKey={1} title="Showtimes">
        {showTimes}
      </Tab>
      <Tab eventKey={2} title="Movie Details">
        {movie.overview &&
          <div>
            <h4>Synopsis</h4>
            <p>
              {movie.overview}
            </p>
          </div>}
        {movie.actors &&
          <div>
            <h4>Actors</h4>
            <p>
              {movie.actors}
            </p>
          </div>}
        {movie.runtime &&
          <div>
            <h4>Runtime</h4>
            <p>
              {movie.runtime} mins
            </p>
          </div>}
        {sfcinemaData.rating &&
          <div>
            <h4>Rated</h4>
            <p>
              {sfcinemaData.rating}
            </p>
          </div>}
      </Tab>
      <Tab eventKey={3} title="Reviews">
        <br />
        {review}
      </Tab>
    </Tabs>
  );
};

export default MovieDetails;
