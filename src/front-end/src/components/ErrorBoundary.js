import React, { Component } from 'react';
import { Grid, Row, Col, Alert } from 'react-bootstrap';
const bg = require('../images/crash.jpg');

const styles = {
  root: {
    backgroundImage: `url(${bg})`,
    backgroundSize: 'cover',
    height: '100%'
  },
  alert: {
    marginTop: '88px'
  },
  code: {
    margin: '33px'
  }
};

class ErrorBoundary extends Component {
  constructor() {
    super();
    this.state = {
      hasError: false,
      error: null
    };
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true, error: error.message });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.root}>
          <Grid>
            <Row className="show-grid">
              <Col xs={12} smOffset={3} sm={6}>
                <Alert bsStyle="danger" style={styles.alert}>
                  <h4>Damn... something went wrong</h4>
                  <div style={styles.code}>
                    <code>{this.state.error}</code>
                  </div>
                  <p>
                    Please{' '}
                    <a
                      href={`mailto:support@andrewgolightly.com?subject=Chiang Mai Movies app error&body=${
                        this.state.error
                      }`}
                    >
                      contact us
                    </a>{' '}
                    and let us know! Thanks.
                  </p>
                </Alert>
              </Col>
            </Row>
          </Grid>
        </div>
      );
    } else {
      return this.props.children;
    }
  }
}

export default ErrorBoundary;
