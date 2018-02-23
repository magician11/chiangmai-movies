/*
Script to fetch movie showtimes from SF Cinemacity,
as well as the meta data for each movie, and store that data to Firebase.
*/

// npm libraries
const admin = require('firebase-admin');
const sfcinemacity = require('sfcinemacity');
const delay = require('delay');

// modules
const movieDatabases = require('./modules/movie-databases');

if (!process.env.MOVIES_DATABASE_URL) {
  console.log(`The MOVIES_DATABASE_URL environment variable cannot be found.
Aborting...`);
  return;
}

const updateMovieDB = async movieTheatreId => {
  try {
    // setup Firebase
    const firebaseApp = admin.initializeApp({
      credential: admin.credential.cert('./private-key.json'),
      databaseURL: process.env.MOVIES_DATABASE_URL
    });

    const db = admin.database();
    const ref = db.ref('/');
    console.log(
      `Updating movie database information on ${new Date().toString()}`
    );

    // first wipe out all the data to minimise the data downloaded on the client
    await ref.remove();

    const totalDaysToFetch = 3;

    for (let dayOffset = 0; dayOffset < totalDaysToFetch; dayOffset += 1) {
      // get the showtimes for a specific day
      const showtimes = await sfcinemacity.getShowtimes(
        movieTheatreId,
        dayOffset
      );

      console.log(
        `Found ${showtimes.movies.length} movies playing on ${
          showtimes.date
        } at ${
          showtimes.movieTheatreName
        } (movie theatre ID: ${movieTheatreId})`
      );

      // check if showtimes were returned
      if (showtimes.movies.length !== 0) {
        for (let movie of showtimes.movies) {
          // replace illegal Firebase keys with a -
          const movieKey = movie.movieTitle.replace(/\.|\$|\[|\]|#|\//g, '-');

          // save the showtime info to Firebase
          await ref
            .child(
              `movie-theatres/chiangmai/${movieTheatreId}/${
                showtimes.date
              }/${movieKey}`
            )
            .set(movie.cinemas);

          let movieData = {
            rating: movie.rating
          };

          const movieDbData = await movieDatabases.theMovieDB(movie.movieTitle);
          movieData = Object.assign(movieData, movieDbData);
          const rottenTomatoesData = await movieDatabases.rottenTomatoes(
            movie.movieTitle
          );
          movieData = Object.assign(movieData, rottenTomatoesData);

          await ref.child(`movie-details/${movieKey}`).set(movieData);
          console.log(`Saved movie data for ${movie.movieTitle}.`);
          await delay(1100);
        }
      } else {
        console.log('No showtimes found.');
      }
    }
    console.log('Data scraping complete.');
    firebaseApp.delete();
  } catch (error) {
    console.log(`Something went wrong: ${error}`);
  }
};

if (process.argv.length === 3) {
  updateMovieDB(process.argv[2]);
} else {
  console.log('usage: node store-movie-details.js [movie theatre ID]');
}
