import React, { Component } from 'react';
import { Grid, Paper, Typography, CssBaseline } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const bg = require('../images/crash.jpg');

const styles = {
  root: {
    backgroundImage: `url(${bg})`,
    backgroundSize: 'cover',
    height: '100%'
  },
  card: {
    padding: 22,
    marginTop: 220,
    height: 220,
    width: 330
  }
};

class ErrorBoundary extends Component {
  state = {
    hasError: false,
    error: null
  };

  componentDidCatch(error, info) {
    this.setState({ hasError: true, error: error.message });
  }

  render() {
    const { classes } = this.props;
    if (this.state.hasError) {
      return (
        <div className={classes.root}>
          <CssBaseline />
          <Grid container justify="center">
            <Grid item>
              <Paper className={classes.card}>
                <Typography variant="h5" gutterBottom>
                  {this.state.error}
                </Typography>
                <Typography variant="body1">
                  Please{' '}
                  <a
                    href={`mailto:support@andrewgolightly.com?subject=Chiang Mai Movies app error&body=${this.state.error}`}
                  >
                    contact us
                  </a>{' '}
                  and let us know! Thanks.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </div>
      );
    } else {
      return this.props.children;
    }
  }
}

export default withStyles(styles)(ErrorBoundary);
