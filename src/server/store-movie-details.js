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
    const movieTheatreShowtimes = {}; // to hold showtimes for multiple days
    let showtimes; // showtimes for a day. Re-used later.
    const totalDaysToFetch = 3;

    for (let dayOffset = 0; dayOffset < totalDaysToFetch; dayOffset += 1) {
      // get the showtimes for a specific day
      showtimes = await sfcinemacity.getShowtimes(mayaMallId, dayOffset);

      // check movie times are listed for this day
      if (showtimes.movieTimes) {
        movieTheatreShowtimes[showtimes.date] = showtimes.movieTimes;
      }
    }

    // save that showtime info to Firebase
    await ref
      .child(`movie-theatres/chiangmai/${mayaMallId}`)
      .set(movieTheatreShowtimes);
    console.log(
      `Updated showtime data for the next ${totalDaysToFetch} days.`
    );

    // go through each movie and save the meta data for it to Firebase
    console.log('Updating movie details...');
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

    await firebaseApp.delete();
    console.log('All done.');

    // log out any errors
  } catch (error) {
    console.log(`Something went wrong: ${error}`);
  }
};

updateMovieDB();
// setInterval(() => {
//   updateMovieDB();
// }, 4.32e+7);
