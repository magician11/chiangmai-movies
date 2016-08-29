const request = require('request');

// https://github.com/cheeriojs/cheerio
const cheerio = require('cheerio');

const movieData = {};

// collate the movie data
request('https://booking.sfcinemacity.com/visPrintShowTimes.aspx?visLang=1&visCinemaId=9936', (err, httpResponse, body) => {
  const $ = cheerio.load(body);

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

  // test out the data by showing movie info for x days ahead..
  const daysAhead = 1;
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + daysAhead);

  console.log(`Target date is ${targetDate.toDateString()}`);

  for (const movieName of Object.keys(movieData)) {
    for (const movieDate of Object.keys(movieData[movieName])) {
      if (movieDate.includes(` ${targetDate.getDate()} `)) {
        console.log(`${movieName} is showing at ${movieData[movieName][movieDate]}`);
      }
    }
  }
});
