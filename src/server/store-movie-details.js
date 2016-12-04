/*
Script to periodically grab movie data from various sources, and
combine into a single useful movie object to be saved on Firebase.
*/

const admin = require('firebase-admin');
const sfcinemacity = require('./modules/sfcinemacity');
const movieDatabases = require('./modules/movie-databases');

// Setup Firebase
admin.initializeApp({
  credential: admin.credential.cert('./private-key.json'),
  databaseURL: process.env.MOVIES_DATABASE_URL,
});

const db = admin.database();
const ref = db.ref('movie-data');

const mayaMallId = 9936;

// get all the current movie titles for Maya Mall
sfcinemacity.getMovieTitles(mayaMallId)

// then grab movie data for those movie titles and write that to Firebase
.then((movieTitles) => {
  // go through every movie title
  movieTitles.forEach((movieTitle) => {
    // and grab the OMDB movie data
    movieDatabases.omdb(movieTitle)
    .then((movieData) => {
      ref.child(movieTitle).set(movieData);
    })

    // and add The Movie DB data too
    .then(() => movieDatabases.theMovieDB(movieTitle))
    .then((theMovieDbData) => {
      ref.child(movieTitle).update({ trailer: theMovieDbData });
    })

    // Any errors, then print them out
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(`Oops: ${error}`);
    });
  });
});
