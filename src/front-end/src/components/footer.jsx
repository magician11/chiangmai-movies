import React, { Component } from 'react';
import { Alert, Modal, Glyphicon, Button } from 'react-bootstrap';

/* eslint-disable max-len */

class Footer extends Component {
  constructor() {
    super();
    this.state = {
      showModal: false,
    };
  }

  render() {
    return (
      <div className="text-center">
        <Modal
          bsSize="large"
          aria-labelledby="about-modal"
          show={this.state.showModal}
          onHide={() => this.setState({ showModal: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title id="about-modal">About Chiang Mai Movies</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>How It All Started</h4>
            <p>Trying to find showtimes for movies in Chiang Mai (Thailand) was a surprisingly difficult thing to do. So being a web developer, I decided to build an app that would provide everything I normally look for when I look up what is playing.</p>
            <p>Thus the app needed to clearly show me the showtimes, as well as the meta data I normally look up afterwards, such as: the trailer, Rotten Tomatoes score, reviews, synopsis, actors, and runtime.</p>
            <h4>How Does It Work Exactly?</h4>
            <p>Everytime you load the page, the list of available movies and their showtimes are scraped from <a href="https://booking.sfcinemacity.com/visPrintShowTimes.aspx?visLang=1&visCinemaId=9936">the SF Cinema City booking system</a>. This data is then augmented with movie meta data which is periodically obtained from <a href="https://www.themoviedb.org/">The Movie DB</a>, <a href="http://www.omdbapi.com/">OMDb</a>, and <a href="http://www.rottentomatoes.com">Rotten Tomatoes</a> itself.</p>
            <h4>Questions/Feedback</h4>
            <p>I welcome all questions and feedback. The whole purpose of this app was to make it super easy for people to find out movie times. So if you have any suggestions or feedback to support this mission, you can get in touch with me <a href="http://golightlyplus.com/contact/">here</a>.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => this.setState({ showModal: false })}>Close</Button>
          </Modal.Footer>
        </Modal>
        <Alert bsStyle="info">
          <Button onClick={() => this.setState({ showModal: true })}>
            <Glyphicon glyph="info-sign" /> About
          </Button>
        </Alert>
        <p>
          <Glyphicon glyph="heart" /> Created by <a href="http://www.golightlyplus.com">Andrew Golightly</a> (
          <a href="https://github.com/magician11/chiangmai-movies">source code</a>
          )
        </p>
      </div>
    );
  }
}

export default Footer;
