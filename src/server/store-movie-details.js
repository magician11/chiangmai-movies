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

const updateMovieDatabase = () => {
  // eslint-disable-next-line no-console
  console.log(`Updating movie database information at ${new Date().toString()}`);

  // get all the current movie titles for Maya Mall
  sfcinemacity.getMovieTitlesAndRatings(mayaMallId)

  // then grab movie data for those movie titles and write that to Firebase
  .then((movies) => {
    const moviePromises = [];
    // go through every movie title
    movies.forEach((movie) => {
      moviePromises.push(new Promise((resolve, reject) => {
        // we'll first save the rating as set on the sfcinemacity website
        ref.child(movie.title).update({ rating: movie.rating });

        // then grab the OMDB movie data
        movieDatabases.omdb(movie.title)
        .then((movieData) => {
          ref.child(movie.title).update(movieData);
        })

        // then add The Movie DB data too
        .then(() => movieDatabases.theMovieDB(movie.title))
        .then((theMovieDbData) => {
          ref.child(movie.title).update({ trailer: theMovieDbData });
          resolve(movie.title);
        })

        // Any errors, then print them out
        .catch((error) => {
          reject(`Error adding movie detail data: ${error}`);
        });
      }));
    });

    return Promise.all(moviePromises);
  })

  // log out any errors
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.log(`Something went wrong: ${error}`);
  });
};

// run once, then update the Firebase database every 3 hours
updateMovieDatabase();
setInterval(updateMovieDatabase, 3 * 60 * 60 * 1000);
