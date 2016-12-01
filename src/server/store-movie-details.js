/*
Script to periodically grab movie data from various sources, and
combine into a single useful movie object to be saved on Firebase.
*/

const admin = require('firebase-admin');
const sfcinemacity = require('./modules/sfcinemacity');

admin.initializeApp({
  credential: admin.credential.cert('./private-key.json'),
  databaseURL: process.env.MOVIES_DATABASE_URL,
});

// Get a database reference to our blog
const db = admin.database();
const ref = db.ref('movie-data');

sfcinemacity.getShowtimes(9936)
.then((showTimes) => {
  ref.set(showTimes);
})
.catch((error) => {
  // eslint-disable-next-line no-console
  console.log(error);
});
