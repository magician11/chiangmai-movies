/* eslint-disable max-len */

import React, { Component } from 'react';
import { Row, Col, Image, Modal, Button } from 'react-bootstrap';
import MovieDetails from './movie-details';
import MovieLinks from './movie-links';

class MovieListings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: Array(props.movieData.length).fill(false)
    };

    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
  }

  close(i) {
    const modals = this.state.showModal;
    modals[i] = false;
    this.setState({ showModal: modals });
  }

  open(i) {
    const modals = this.state.showModal;
    modals[i] = true;
    this.setState({ showModal: modals });
  }

  render() {
    const { movieData, targetDate } = this.props;
    const movieListingsForTargetDate =
      movieData['movie-theatres'].chiangmai['9936'][targetDate];
    const movieTitles = Object.keys(movieListingsForTargetDate);
    const movieShowings = [];
    for (let i = 0; i < movieTitles.length; i += 1) {
      const sfcinemaMovieData = movieListingsForTargetDate[movieTitles[i]];
      const movieMetaData = movieData['movie-details'][movieTitles[i]];
      console.log(sfcinemaMovieData);
      console.log(movieMetaData);
      const movieImage = movieMetaData.posterImage
        ? movieMetaData.posterImage
        : 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBoZWlnaHQ9IjMwMHB4IiB3aWR0aD0iMzAwcHgiIHZlcnNpb249IjEuMCIgdmlld0JveD0iLTMwMCAtMzAwIDYwMCA2MDAiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Y2lyY2xlIHN0cm9rZT0iI0FBQSIgc3Ryb2tlLXdpZHRoPSIxMCIgcj0iMjgwIiBmaWxsPSIjRkZGIi8+Cjx0ZXh0IHN0eWxlPSJsZXR0ZXItc3BhY2luZzoxO3RleHQtYW5jaG9yOm1pZGRsZTt0ZXh0LWFsaWduOmNlbnRlcjtzdHJva2Utb3BhY2l0eTouNTtzdHJva2U6IzAwMDtzdHJva2Utd2lkdGg6MjtmaWxsOiM0NDQ7Zm9udC1zaXplOjM2MHB4O2ZvbnQtZmFtaWx5OkJpdHN0cmVhbSBWZXJhIFNhbnMsTGliZXJhdGlvbiBTYW5zLCBBcmlhbCwgc2Fucy1zZXJpZjtsaW5lLWhlaWdodDoxMjUlO3dyaXRpbmctbW9kZTpsci10YjsiIHRyYW5zZm9ybT0ic2NhbGUoLjIpIj4KPHRzcGFuIHk9Ii00MCIgeD0iOCI+Tk8gSU1BR0U8L3RzcGFuPgo8dHNwYW4geT0iNDAwIiB4PSI4Ij5BVkFJTEFCTEU8L3RzcGFuPgo8L3RleHQ+Cjwvc3ZnPg==';

      movieShowings.push(
        <Row key={movieMetaData.title}>
          <Col xs={4}>
            <Image
              src={movieImage}
              alt={movieMetaData.title}
              thumbnail
              responsive
              onClick={() => this.open(i)}
            />
            <Modal show={this.state.showModal[i]} onHide={() => this.close(i)}>
              <Modal.Header closeButton>
                <Modal.Title>
                  {movieMetaData.title}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className="text-center">
                <Image
                  src={movieImage}
                  alt={movieMetaData.title}
                  thumbnail
                  responsive
                />
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={() => this.close(i)}>Close</Button>
              </Modal.Footer>
            </Modal>
          </Col>
          <Col xs={8}>
            <div className="hidden-xs">
              <h2>
                {movieMetaData.title}
              </h2>
              <MovieLinks movie={movieMetaData} />
              <MovieDetails
                movie={movieMetaData}
                sfcinemaData={sfcinemaMovieData}
                defaultTab={2}
              />
            </div>
            <div className="visible-xs">
              <h4>
                {movieMetaData.title}
              </h4>
              <MovieLinks movie={movieMetaData} />
            </div>
          </Col>
        </Row>,
        <Row
          key={`${movieMetaData.title} - timesAndTrailer`}
          className="visible-xs"
        >
          <Col xs={12}>
            <MovieDetails
              movie={movieMetaData}
              sfcinemaData={sfcinemaMovieData}
              defaultTab={1}
            />
          </Col>
        </Row>,
        <Row key={`${movieMetaData.title} - hr`}>
          <Col xs={12}>
            <hr />
          </Col>
        </Row>
      );
    }

    return (
      <div>
        {movieShowings}
      </div>
    );
  }
}

export default MovieListings;
