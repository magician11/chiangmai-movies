const cheerio = require('cheerio');
const rp = require('request-promise-native');
const express = require('express');
const cors = require('cors'); // Cross-Origin Resource Sharing

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

      const titleAndLanguage = movieName.match(/(.+) \((.+)\)/);

      formattedMovieData.push({
        title: titleAndLanguage[1],
        language: titleAndLanguage[2],
        showTimes,
      });
    }

    return formattedMovieData;
  })
  .then((movieData) => { // filter out the language requested if stated
    if (req.query.language) {
      const filteredMovieData = movieData
      .filter((movie) => movie.language.startsWith(req.query.language));
      return filteredMovieData;
    }

    return movieData;
  })
  .then((filteredMovieData) => { // add movie meta data from https://www.themoviedb.org/
    const addMovieData = (movie) =>
    new Promise((resolve, reject) => {
      const movieDbOptions = {
        uri: `http://api.themoviedb.org/3/search/movie?query=${movie.title}&api_key=41c36dd400094f4bdbec4a66c776d775`,
        json: true,
      };

      rp(movieDbOptions)
      .then((result) => {
        const movieData = result.results[0];
        let extraMetaData = {};
        if (movieData) { // if we get a result for this search
          return new Promise((resolveVideoData, rejectVideoData) => {
            // console.log('Movie data...');
            // console.log(movieData);
            // Get the movie trailer for it
            movieDbOptions.uri = `https://api.themoviedb.org/3/movie/${movieData.id}/videos?api_key=41c36dd400094f4bdbec4a66c776d775&language=en-USv`;
            rp(movieDbOptions)
            .then((videoData) => {
              // console.log('Video data...');
              // console.log(videoData.results);
              // loop through the results to find the object that is tagged with type 'Trailer'
              let trailerVideo;
              videoData.results.forEach((video) => {
                if (video.type === 'Trailer') {
                  trailerVideo = video.key;
                }
              });

              extraMetaData = {
                overview: movieData.overview,
                score: movieData.vote_average,
                image: `http://image.tmdb.org/t/p/w500${movieData.poster_path}`,
                trailer: trailerVideo,
              };
              resolveVideoData(Object.assign(movie, extraMetaData));
            })
            .catch((error) => {
              rejectVideoData(error);
            });
          });
        }
        extraMetaData = {
          overview: 'No description available.',
          score: 'not rated',
          // eslint-disable-next-line max-len
          image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjAiIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0iI2ZhbHNlIiA+ICAgIDxwYXRoIGQ9Ik0gMjcuNSAwIEMgMjIuNzYzNzg0IDAgMTguODM2MDgxIDMuNDkxMzgzNCAxOC4xMjUgOC4wMzEyNSBDIDE2Ljg2NzgzNiA1LjY0NjQxNjIgMTQuMzc3Njg1IDQgMTEuNSA0IEMgNy4zNjUgNCA0IDcuMzY1IDQgMTEuNSBDIDQgMTQuODU5Njg3IDYuMjMwMjk2NiAxNy43MDUxMDEgOS4yODEyNSAxOC42NTYyNSBDIDcuMzI3NzQ3NCAxOS42MzUwNDYgNiAyMS42MjcwOTMgNiAyNCBMIDYgMzUgQyA2IDM4LjM2NCA4LjYzNiA0MSAxMiA0MSBMIDI5IDQxIEMgMzIuMzY0IDQxIDM1IDM4LjM2NCAzNSAzNSBMIDM1IDI0IEMgMzUgMjEuMzM4OTA3IDMzLjM1NDUzNCAxOS4xMTgwMSAzMSAxOC4zMTI1IEMgMzQuNTA0OTA1IDE2LjkxMjk0MSAzNyAxMy40OTgxMjMgMzcgOS41IEMgMzcgNC4yNjIgMzIuNzM4IDAgMjcuNSAwIHogTSAxOC43ODEyNSAxMy4yNSBDIDE5LjY3NDIzMyAxNS4zMTUzNjMgMjEuMjc0NzY2IDE3LjAwMDkzMiAyMy4yODEyNSAxOCBMIDE1LjIxODc1IDE4IEMgMTYuOTc4MzAzIDE2Ljk4Njk2IDE4LjI5MjEyIDE1LjI3MzcxNyAxOC43ODEyNSAxMy4yNSB6IE0gNDYgMTguMzc1IEwgMzYuOTM3NSAyMi45MDYyNSBDIDM2Ljk4MzUgMjMuMjU5MjUgMzcgMjMuNjMyIDM3IDI0IEwgMzcgMzUgQyAzNyAzNS42OTEgMzYuOTA3IDM2LjM2MyAzNi43NSAzNyBMIDQ2IDQxLjYyNSBMIDQ2IDE4LjM3NSB6IE0gMTUuNSA0MyBMIDE0LjUgNDQgTCA4LjUgNTAgTCAxMSA1MCBMIDE0IDUwIEwgMTYuNSA1MCBMIDIxIDQ1LjUgTCAyNS41IDUwIEwgMjcuOTM3NSA1MCBMIDI4IDUwIEwgMzMuNSA1MCBMIDI3LjUgNDQgTCAyNi41IDQzIEwgMTUuNSA0MyB6Ij48L3BhdGg+PC9zdmc+',
          trailer: '',
        };

        return Promise.resolve(Object.assign(movie, extraMetaData));
      })
      .then((finalMovieObject) => {
        console.log('Final movie object');
        console.log(finalMovieObject);
        resolve(finalMovieObject);
      })
      .catch((err) => {
        reject(err);
      });
    });

    const moviesWithMetaData = [];
    filteredMovieData.forEach((movie) => {
      moviesWithMetaData.push(new Promise((resolve, reject) => {
        try {
          resolve(addMovieData(movie));
        } catch (err) {
          reject(err);
        }
      }));
    });

    return Promise.all(moviesWithMetaData);
  })
  .then((movieData) => res.json(movieData)) // return data as a json response
  .catch((err) => {
    res.send(err.toString());
  });
});

const port = 3000;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Movies data app listening on port ${port}.`);
});
