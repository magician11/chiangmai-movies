/*
Script to fetch movie showtimes from SF Cinemacity,
as well as the meta data for each movie, and store that data to Firebase.
*/

// npm libraries
const admin = require('firebase-admin');
const sfcinemacity = require('sfcinemacity');

// modules
const movieDatabases = require('./modules/movie-databases');

if (!process.env.MOVIES_DATABASE_URL) {
  console.log(`The MOVIES_DATABASE_URL environment variable cannot be found.
Aborting...`);
  return;
}

// setup Firebase
const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert('./private-key.json'),
  databaseURL: process.env.MOVIES_DATABASE_URL
});

const db = admin.database();
const ref = db.ref('/');

const updateMovieDB = async () => {
  try {
    console.log(
      `Updating Maya Mall movie database information at ${new Date().toString()}`
    );

    const mayaMallId = 9936;

    // first wipe out all the data to minimise the data downloaded on the client
    await ref.remove();

    const totalDaysToFetch = 3;

    for (let dayOffset = 0; dayOffset < totalDaysToFetch; dayOffset += 1) {
      // get the showtimes for a specific day
      const showtimes = await sfcinemacity.getShowtimes(mayaMallId, dayOffset);

      console.log(
        `Getting showtimes for ${showtimes.movieTheatreName} for ${
          showtimes.date
        }`
      );

      // check if showtimes were returned
      if (showtimes.movies.length !== 0) {
        // save that showtime info to Firebase
        await ref
          .child(`movie-theatres/chiangmai/${mayaMallId}/${showtimes.date}`)
          .set(showtimes.movies);
        console.log(`Saved showtime data.`);

        // go through each movie and save the meta data for it to Firebase
        console.log('Updating movie metadata for this day...');
        for (let movie of showtimes.movies) {
          // replace illegal Firebase keys with a -
          const movieTitle = movie.movieTitle.replace(/\.|\$|\[|\]|#|\//g, '-');
          let movieData = {
            rating: movie.rating
          };

          const movieDbData = await movieDatabases.theMovieDB(movieTitle);
          movieData = Object.assign(movieData, movieDbData);
          const rottenTomatoesData = await movieDatabases.rottenTomatoes(
            movieTitle
          );
          movieData = Object.assign(movieData, rottenTomatoesData);

          await ref.child(`movie-details/${movieTitle}`).set(movieData);
          console.log(`Updated movie data for ${movieTitle}.`);
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

updateMovieDB();
