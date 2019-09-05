import React from 'react';

import MovieUI from './MovieUI';
import { StateProvider } from './AppState';

const MovieApp = () => {
  const initialState = {
    movieDetails: null,
    movieListings: null,
    selectedDate: null
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case 'setSelectedDate':
        return {
          ...state,
          selectedDate: action.newDate
        };
      case 'setMovieDetails':
        return {
          ...state,
          movieDetails: action.movieDetails
        };
      case 'setMovieListings':
        return {
          ...state,
          movieListings: action.movieListings
        };

      default:
        return state;
    }
  };

  return (
    <StateProvider reducer={reducer} initialState={initialState}>
      <MovieUI />
    </StateProvider>
  );
};

export default MovieApp;
