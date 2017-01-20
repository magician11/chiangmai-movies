/*
Script to periodically grab movie data from various sources, and
combine into a single useful movie object to be saved on Firebase.
*/

/* eslint-disable no-console */

// npm libraries
const admin = require('firebase-admin');
const sfcinemacity = require('sfcinemacity');

// modules
const movieDatabases = require('./modules/movie-databases');

// setup Firebase
admin.initializeApp({
  credential: admin.credential.cert('./private-key.json'),
  databaseURL: process.env.MOVIES_DATABASE_URL,
});

const db = admin.database();
const ref = db.ref('movie-data');

const mayaMallId = 9936;

console.log(`Updating movie database information at ${new Date().toString()}`);

// get all the current movie titles for Maya Mall
sfcinemacity.getMovieTitlesAndRatings(mayaMallId)

// then grab movie data for those movie titles and write that to Firebase
.then((movies) => {
  console.log(`Processing ${movies.length} movies.`);
  const moviePromises = [];
  // go through every movie title
  movies.forEach((movie) => {
    moviePromises.push(new Promise((resolve, reject) => {
      let newMovie = {};

      // set the rating as specified on the sfcinemacity website
      newMovie.rating = movie.rating;

      // then add The Movie DB data too
      movieDatabases.theMovieDB(movie.title)
      .then((theMovieDbData) => {
        newMovie = Object.assign(newMovie, theMovieDbData);
        return theMovieDbData;
      })

      // then grab the OMDB movie data with the title from The Movie DB
      .then(theMovieDbData => movieDatabases.omdb(theMovieDbData.title, theMovieDbData.releaseDate.match(/\d{4}/)[0]))
      .then((omdbMovieData) => {
        newMovie = Object.assign(newMovie, omdbMovieData);
        return newMovie.rottenTomatoesUrl;
      })

      // then augment with the latest data from Rotten Tomatoes
      .then(rottenTomatoesUrl => movieDatabases.rottenTomatoes(rottenTomatoesUrl))
      .then((rottenTomatoesData) => {
        newMovie = Object.assign(newMovie, rottenTomatoesData);
      })

      // write the newMovie object to Firebase
      .then(() => {
        ref.child(movie.title).update(newMovie, () => {
          console.log(`Updated ${newMovie.title}`);
          resolve(movie.title);
        });
      })

      // Any errors, then print them out
      .catch((error) => {
        reject(`Error adding movie detail data: ${error}`);
      });
    }));
  });

  // Close database connection after all data has been written to Fireabse
  return Promise.all(moviePromises).then(() => {
    console.log('All done.');
    db.goOffline();
  });
})

// log out any errors
.catch((error) => {
  console.log(`Something went wrong: ${error}`);
});
