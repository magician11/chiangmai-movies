/*
Script to periodically grab movie data from various sources, and
combine into a single useful movie object to be saved on Firebase.
*/

/* eslint-disable no-console */

// npm libraries
const admin = require('firebase-admin');

// modules
const movieDatabases = require('./modules/movie-databases');

// setup Firebase
admin.initializeApp({
  credential: admin.credential.cert('./private-key.json'),
  databaseURL: process.env.MOVIES_DATABASE_URL,
});

const db = admin.database();
const ref = db.ref('movie-data');

const manualMovieTitle = 'Chihayafuru Part 2';
const manualMovieYear = 2016;

console.log(`Updating movie database information at ${new Date().toString()}`);

let newMovie = {};

// get The Movie DB data
movieDatabases.theMovieDB(manualMovieTitle, manualMovieYear)
.then((theMovieDbData) => {
  newMovie = Object.assign(newMovie, theMovieDbData);
  return theMovieDbData;
})

// then add the Rotten Tomatoes data
.then(theMovieDbData => movieDatabases.rottenTomatoes(theMovieDbData.title))
.then((rottenTomatoesData) => {
  newMovie = Object.assign(newMovie, rottenTomatoesData);
})

// write the newMovie object to Firebase
.then(() => {
  const dbMovieTitle = manualMovieTitle.replace(/\.|#|\$|\[|]/g, '-');
  ref.child(dbMovieTitle).update(newMovie, () => {
    console.log(`Updated ${newMovie.title}`);
    console.log('All done.');
    db.goOffline();
  });
})

// Any errors, then print them out
.catch((error) => {
  console.log(`Error adding movie detail data: ${error}`);
});
