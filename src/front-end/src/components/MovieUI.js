import React, { useEffect, Fragment, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/database';
import ReactGA from 'react-ga';
import { CssBaseline, Grid, LinearProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Header from './Header';
import MovieCard from './MovieCard';
import { GetState } from './AppState';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(8),
    padding: theme.spacing(3)
  },
  movieItem: {
    marginBottom: theme.spacing(3)
  }
}));

const MovieUI = () => {
  const classes = useStyles();
  const [error, setError] = useState();
  const [{ movieDetails, movieListings, selectedDate }, dispatch] = GetState();

  useEffect(() => {
    const fetchData = async () => {
      const config = {
        apiKey: 'AIzaSyC_Bv5Apio1PBrO048figZ6i3B_nkccoMw',
        authDomain: 'movies-387bf.firebaseapp.com',
        databaseURL: 'https://movies-387bf.firebaseio.com',
        projectId: 'movies-387bf',
        storageBucket: 'movies-387bf.appspot.com',
        messagingSenderId: '208320671675'
      };
      firebase.initializeApp(config);
      const database = firebase.database();
      const dataSnapshot = await database.ref('/').once('value');
      const firebaseMovieData = dataSnapshot.val();

      if (!firebaseMovieData) {
        setError(
          "I'm sorry, but it doesn't look like any movie data is available at present."
        );
        return;
      }

      dispatch({
        type: 'setMovieListings',
        movieListings: firebaseMovieData['movie-theatres'].chiangmai['9936']
      });

      dispatch({
        type: 'setMovieDetails',
        movieDetails: firebaseMovieData['movie-details']
      });

      dispatch({
        type: 'setSelectedDate',
        newDate: Object.keys(
          firebaseMovieData['movie-theatres'].chiangmai['9936']
        )[0]
      });
    };

    // track app views with Google Analytics
    ReactGA.initialize('UA-63340534-3');
    ReactGA.pageview(window.location.pathname);

    fetchData();
  }, [dispatch]);

  if (error) {
    throw new Error(error);
  }

  let content;

  if (movieListings && selectedDate) {
    // sort the movies by Rotten Tomatoes score
    const knownScores = [],
      unknownScores = [];
    // separate the movies that have scores with those that don't
    for (const title of Object.keys(movieListings[selectedDate])) {
      if (movieDetails[title].meterScore) {
        knownScores.push(title);
      } else {
        unknownScores.push(title);
      }
    }
    // sort the movies that have scores
    knownScores.sort((movieTitle1, movieTitle2) =>
      movieDetails[movieTitle1].meterScore <
      movieDetails[movieTitle2].meterScore
        ? 1
        : -1
    );

    // define the grid item that will hold the movie card
    const movieGridItem = movieTitle => (
      <Grid
        item
        xs={12}
        sm={6}
        md={4}
        className={classes.movieItem}
        key={movieTitle}
      >
        <MovieCard
          movieData={movieDetails[movieTitle]}
          showTimes={movieListings[selectedDate][movieTitle]}
        />
      </Grid>
    );

    // add the sorted movies by scores first, then the unsorted items
    content = knownScores.map(movieTitle => movieGridItem(movieTitle));
    content.push(unknownScores.map(movieTitle => movieGridItem(movieTitle)));
  } else {
    content = (
      <Grid item xs={8} sm={4}>
        <LinearProgress />
      </Grid>
    );
  }

  // scroll to top of screen before rendering movie data
  window.scrollTo(0, 0);

  return (
    <Fragment>
      <CssBaseline />
      <Header movieTimes={movieListings} />
      <div className={classes.root}>
        <Grid container justify="center">
          {content}
        </Grid>
      </div>
    </Fragment>
  );
};

export default MovieUI;
