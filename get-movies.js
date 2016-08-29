const request = require('request');

// https://github.com/cheeriojs/cheerio
const cheerio = require('cheerio');

const movieData = {};

request('https://booking.sfcinemacity.com/visPrintShowTimes.aspx?visLang=1&visCinemaId=9936', (err, httpResponse, body) => {
  const $ = cheerio.load(body);

  let currentMovie;
  let currentDate;
  $('#tblShowTimes td').each(function () {
    //console.log($(this).text());
    if ($(this).hasClass('PrintShowTimesFilm')) {
      currentMovie = $(this).text();
      movieData[currentMovie] = {};
    } else if ($(this).hasClass('PrintShowTimesDay')) {
      currentDate = $(this).text();
    } else if ($(this).hasClass('PrintShowTimesSession')) {
      movieData[currentMovie][currentDate] = $(this).text();
    }
  });

  console.log(movieData);
});
