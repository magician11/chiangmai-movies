/*
Script to fetch movie showtimes from SF Cinemacity,
as well as the meta data for each movie, and store that data to Firebase.
*/

// npm libraries
const admin = require('firebase-admin');
const sfcinemacity = require('sfcinemacity');
const rottenTomatoes = require('rottentomatoes-data');
const delay = require('delay');
const secrets = require('./config/secrets');

// modules
const movieDatabases = require('./modules/movie-databases');

const updateMovieDB = async movieTheatreId => {
  try {
    // setup Firebase
    const firebaseApp = admin.initializeApp({
      credential: admin.credential.cert('./config/private-key.json'),
      databaseURL: secrets.databaseURL
    });

    const db = admin.database();
    const ref = db.ref('/');
    console.log(
      `Updating movie database information on ${new Date().toString()}`
    );

    // first wipe out all the data to minimise the data downloaded on the client
    await ref.remove();

    const totalDaysToFetch = 5;

    for (let dayOffset = 0; dayOffset < totalDaysToFetch; dayOffset += 1) {
      // get the showtimes for a specific day
      const showtimes = await sfcinemacity.getShowtimes(
        movieTheatreId,
        dayOffset
      );

      console.log(
        `Found ${showtimes.movies.length} movies playing on ${showtimes.date} at ${showtimes.movieTheatreName} (movie theatre ID: ${movieTheatreId})`
      );

      // check if showtimes were returned
      if (showtimes.movies.length !== 0) {
        for (let movie of showtimes.movies) {
          // replace illegal Firebase keys with a -
          const movieKey = movie.movieTitle.replace(/\.|\$|\[|\]|#|\//g, '-');

          // save the showtime info to Firebase
          await ref
            .child(
              `movie-theatres/chiangmai/${movieTheatreId}/${showtimes.date}/${movieKey}`
            )
            .set(movie.cinemas);

          let movieData = {
            rating: movie.rating
          };

          const movieDbData = await movieDatabases.theMovieDB(movie.movieTitle);
          movieData = Object.assign(movieData, movieDbData);
          const rottenTomatoesData = await rottenTomatoes(movie.movieTitle);
          if (rottenTomatoesData.ok) {
            movieData = Object.assign(movieData, rottenTomatoesData.movie);
          }

          await ref.child(`movie-details/${movieKey}`).set(movieData);
          console.log(`Saved movie data for ${movie.movieTitle}.`);
          // https://developers.themoviedb.org/3/getting-started/request-rate-limiting
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

// for manual execution
// if (process.argv.length === 3) {
//   updateMovieDB(process.argv[2]);
// } else {
//   console.log('usage: node store-movie-details.js [movie theatre ID]');
// }

// this script runs ever 11 hours
const mayaMall = 9936;
updateMovieDB(mayaMall);
setInterval(() => updateMovieDB(mayaMall), 39600000);
