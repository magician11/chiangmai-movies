const cheerio = require('cheerio');
const rp = require('request-promise-native');
const express = require('express');

const app = express();

app.get('/maya-mall', (req, res) => {
  const options = {
    uri: 'https://booking.sfcinemacity.com/visPrintShowTimes.aspx?visLang=1&visCinemaId=9936',
    transform: (body) => cheerio.load(body),
  };

  rp(options)
  .then(($) => {
    const movieData = {};
    let currentMovie;
    let currentDate;
    $('#tblShowTimes td').each(function () {
      if ($(this).hasClass('PrintShowTimesFilm')) {
        currentMovie = $(this).text();
        movieData[currentMovie] = {};
      } else if ($(this).hasClass('PrintShowTimesDay')) {
        currentDate = $(this).text();
      } else if ($(this).hasClass('PrintShowTimesSession')) {
        movieData[currentMovie][currentDate] = $(this).text();
      }
    });

    res.json(movieData);
  })
  .catch((err) => {
    res.send(err);
  });
});

const port = 3000;

app.listen(port, () => {
  console.log(`Movies times app listening on port ${port}.`);
});
