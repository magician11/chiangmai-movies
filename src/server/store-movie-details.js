/*
Script to periodically grab movie data from various sources, and
combine into a single useful movie object to be saved on Firebase.
*/

// npm libraries
const admin = require('firebase-admin');
const sfcinemacity = require('sfcinemacity');

// modules
const movieDatabases = require('./modules/movie-databases');

if (!process.env.MOVIES_DATABASE_URL) {
  console.log(`The MOVIES_DATABASE_URL environment variable cannot be found.
You might need to run something like: source ~/.bash_profile
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
    const totalDaysToFetch = 3;

    for (let dayOffset = 0; dayOffset < totalDaysToFetch; dayOffset += 1) {
      // get the showtimes for a specific day
      const showtimes = await sfcinemacity.getShowtimes(mayaMallId, dayOffset);

      console.log(
        `Getting showtimes for ${showtimes.movieTheatreName} for ${showtimes.date}`
      );

      // check if showtimes were returned
      if (Object.keys(showtimes.movieTimes).length !== 0) {
        // save that showtime info to Firebase
        await ref
          .child(`movie-theatres/chiangmai/${mayaMallId}/${showtimes.date}`)
          .set(showtimes.movieTimes);
        console.log(`Saved showtime data.`);

        // go through each movie and save the meta data for it to Firebase
        console.log('Updating movie metadata for this day...');
        for (let movieTitle of Object.keys(showtimes.movieTimes)) {
          let movieData = {
            rating: showtimes.movieTimes[movieTitle].rating
          };

          const movieDbData = await movieDatabases.theMovieDB(movieTitle);
          movieData = Object.assign(movieData, movieDbData);
          const rottenTomatoesData = await movieDatabases.rottenTomatoes(
            movieTitle
          );
          movieData = Object.assign(movieData, rottenTomatoesData);

          await ref.child(`movie-details/${movieTitle}`).update(movieData);
          console.log(`Updated movie data for ${movieTitle}.`);
        }
      } else {
        console.log('No showtimes found.');
      }
    }
    console.log('Data scraping complete.');

    // log out any errors
  } catch (error) {
    console.log(`Something went wrong: ${error}`);
  }
};

updateMovieDB();
setInterval(() => {
  updateMovieDB();
}, 3.96e6); // updates the movie db every 1.1 hours
