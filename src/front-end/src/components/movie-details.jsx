import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import Showtimes from './showtimes';
import styling from '../styles/movie-app.css';

const MovieDetails = (props) => {
  const { movie, targetDate, defaultTab } = props;
  const showTimes = <Showtimes times={movie.showTimes[targetDate]} />;

  return (
    <Tabs defaultActiveKey={defaultTab} id="movie-details" className={styling['movie-details']}>
      <Tab eventKey={1} title="Showtimes">
        {showTimes}
      </Tab>
      <Tab eventKey={2} title="Movie Details">
        { movie.overview &&
          <div>
            <h4>Synopsis</h4>
            <p>{movie.overview}</p>
          </div>
        }
        { movie.actors &&
          <div>
            <h4>Actors</h4>
            <p>{movie.actors}</p>
          </div>
        }
        { movie.runtime &&
          <div>
            <h4>Runtime</h4>
            <p>{movie.runtime}</p>
          </div>
        }
        { movie.rating &&
          <div>
            <h4>Rated</h4>
            <p>{movie.rating}</p>
          </div>
        }
      </Tab>
    </Tabs>
  );
};

MovieDetails.propTypes = {
  movie: React.PropTypes.shape({
    actors: React.PropTypes.string.isRequired,
    imdbRating: React.PropTypes.string.isRequired,
    imdbUrl: React.PropTypes.string.isRequired,
    overview: React.PropTypes.string.isRequired,
    posterImage: React.PropTypes.string.isRequired,
    rating: React.PropTypes.string.isRequired,
    rottenTomatoesUrl: React.PropTypes.string.isRequired,
    runtime: React.PropTypes.string.isRequired,
    showTimes: React.PropTypes.object.isRequired,
    title: React.PropTypes.string.isRequired,
    tomatoConsensus: React.PropTypes.string.isRequired,
    tomatoMeter: React.PropTypes.string.isRequired,
    trailer: React.PropTypes.string.isRequired,
  }).isRequired,
  targetDate: React.PropTypes.string.isRequired,
  defaultTab: React.PropTypes.number.isRequired,
};

export default MovieDetails;

/*
TODO: once we have better data coming through.

let review;
if (movie.tomatoConsensus) {
review = (
<blockquote>
<p>{movie.tomatoConsensus}</p>
<footer>
<cite title="Source Title">Rotten Tomatoes</cite>
</footer>
</blockquote>
);
} else {
review = <p>No reviews currently available.</p>;
}

<Tab eventKey={3} title="Reviews">
<br />
{ review }
</Tab>

*/
