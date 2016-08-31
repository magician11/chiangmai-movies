const cheerio = require('cheerio');
const rp = require('request-promise-native');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

/*
Optional parameters:
- language e.g. E for English (language=E)
*/
app.get('/maya-mall', (req, res) => {
  const options = {
    uri: 'https://booking.sfcinemacity.com/visPrintShowTimes.aspx?visLang=1&visCinemaId=9936',
    transform: (body) => cheerio.load(body),
  };

  rp(options)
  .then(($) => { // first extract the movie data from the booking.sfcinemacity.com site
    const movieData = {};
    let currentMovie;
    let currentDate;
    $('#tblShowTimes td').each(function process() {
      if ($(this).hasClass('PrintShowTimesFilm')) {
        currentMovie = $(this).text();
        movieData[currentMovie] = {};
      } else if ($(this).hasClass('PrintShowTimesDay')) {
        currentDate = $(this).text();
      } else if ($(this).hasClass('PrintShowTimesSession')) {
        movieData[currentMovie][currentDate] = $(this).text();
      }
    });

    return movieData;
  })
  .then((movieData) => { // normalise data
    const formattedMovieData = [];
    for (const movieName of Object.keys(movieData)) {
      const showTimes = [];
      for (const movieDate of Object.keys(movieData[movieName])) {
        showTimes.push({
          date: movieDate,
          times: movieData[movieName][movieDate],
        });
      }
      formattedMovieData.push({
        title: movieName,
        showTimes,
      });
    }

    return formattedMovieData;
  })
  .then((movieData) => { // filter out the language requested
    if (req.query.language) {
      const filteredMovieData = movieData
      .filter((movie) => movie.title.includes(`(${req.query.language}`));
      return filteredMovieData;
    }

    return movieData;
  })
  // todo add data from http://www.omdbapi.com/
  // something like http://www.omdbapi.com/?t=PETE%27S%20DRAGON&y=2016&plot=full&r=json&tomatoes=true
  .then((movieData) => res.json(movieData)) // return data as a json response
  .catch((err) => {
    res.send(err);
  });
});

const port = 3000;

app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Movies data app listening on port ${port}.`);
});
