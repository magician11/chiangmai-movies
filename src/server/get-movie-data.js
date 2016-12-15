// libraries
const express = require('express');
const https = require('https');
const fs = require('fs');
const cors = require('cors'); // Cross-Origin Resource Sharing
const admin = require('firebase-admin');

// modules
const sfcinemacity = require('./modules/sfcinemacity');

// setup express
const app = express();
app.use(cors());

// Setup Firebase
admin.initializeApp({
  credential: admin.credential.cert('./private-key.json'),
  databaseURL: process.env.MOVIES_DATABASE_URL,
});

const db = admin.database();
const ref = db.ref('movie-data');

// for routes that goto /maya-mall
app.get('/maya-mall', (req, res) => {
  const mayaMallId = 9936;

  // get all the current movie titles and times for Maya Mall
  sfcinemacity.getShowtimes(mayaMallId)

  // then augment movie data with movie database details
  .then((movies) => {
    const moviePromises = [];
    Object.keys(movies).forEach((movie) => {
      moviePromises.push(new Promise((resolve) => {
        ref.child(movie).once('value', (snapshot) => {
          resolve(Object.assign(movies[movie], snapshot.val()));
        });
      }));
    });

    return Promise.all(moviePromises);
  })

  // return data as a json response
  .then((movieData) => res.json(movieData))

  // send any errors back as a response
  .catch((err) => {
    res.send(err.toString());
  });
});

app.set('port', 3003);

// Connections from Facebook Messenger App have to be encrypted
const sslOptions = {
  key: fs.readFileSync('/etc/letsencrypt/live/golightlyplus.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/golightlyplus.com/fullchain.pem'),
  ca: fs.readFileSync('/etc/letsencrypt/live/golightlyplus.com/chain.pem'),
};

// startup the https server
https.createServer(sslOptions, app).listen(app.get('port'), () => {
  // eslint-disable-next-line no-console
  console.log(`Movies data app listening on port ${app.get('port')}.`);
});
