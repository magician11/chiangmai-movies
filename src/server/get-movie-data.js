const cheerio = require('cheerio');
const rp = require('request-promise-native');
const express = require('express');
const cors = require('cors'); // Cross-Origin Resource Sharing

const app = express();
app.use(cors());

app.get('/maya-mall', (req, res) => {
  const options = {
    uri: 'https://booking.sfcinemacity.com/visPrintShowTimes.aspx?visLang=1&visCinemaId=9936',
    transform: (body) => cheerio.load(body),
  };

  rp(options)
  /*
  First extract the movie data from the booking.sfcinemacity.com site
  and return an object that has
  title -> date -> times

  e.g.

  'FANTASTIC BEASTS AND WHERE TO FIND THEM (E/ATMOS) [G]':
  { 'Sun 27 Nov': '17:40, 20:30, 23:20',
  'Mon 28 Nov': '12:00, 14:50, 17:40, 20:30, 23:20',
  'Tue 29 Nov': '12:00, 14:50, 17:40, 20:30, 23:20',
  'Wed 30 Nov': '12:00, 14:50, 17:40, 20:30, 23:20' },
  */
  .then(($) => {
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
  /*
  Next coalesce the same movies with different languages and sound systems.
  So we have
  movieTitle -> showTimes -> date -> language -> times
  */
  .then((movieData) => {
    const coalescedMovieData = {};
    for (const movieName of Object.keys(movieData)) {
      const titleAndLanguage = movieName.match(/(.+) \((.+)\)/);
      if (!coalescedMovieData[titleAndLanguage[1]]) {
        coalescedMovieData[titleAndLanguage[1]] = {};
        coalescedMovieData[titleAndLanguage[1]].title = titleAndLanguage[1];
        coalescedMovieData[titleAndLanguage[1]].showTimes = {};
      }
      for (const movieDate of Object.keys(movieData[movieName])) {
        if (!coalescedMovieData[titleAndLanguage[1]].showTimes[movieDate]) {
          coalescedMovieData[titleAndLanguage[1]].showTimes[movieDate] = {};
        }

        // eslint-disable-next-line max-len
        coalescedMovieData[titleAndLanguage[1]].showTimes[movieDate][titleAndLanguage[2]] = movieData[movieName][movieDate];
      }
    }
    return coalescedMovieData;
  })
  // add movie meta data from https://www.themoviedb.org/
  .then((sfcinemacityMovieData) => {
    const addMovieData = (movie) =>
    new Promise((resolve, reject) => {
      const movieDbOptions = {
        uri: `http://api.themoviedb.org/3/search/movie?query=${movie.title}&api_key=41c36dd400094f4bdbec4a66c776d775`,
        json: true,
      };

      rp(movieDbOptions)
      .then((result) => {
        /*
        todo: get the most recent release date result
        "release_date": "2016-08-26",
        */
        const movieData = result.results[0];
        let extraMetaData = {};
        if (movieData) { // if we get a result for this search
          return new Promise((resolveVideoData, rejectVideoData) => {
            // Get the movie trailer for it
            movieDbOptions.uri = `https://api.themoviedb.org/3/movie/${movieData.id}/videos?api_key=41c36dd400094f4bdbec4a66c776d775&language=en-USv`;
            rp(movieDbOptions)
            .then((videoData) => {
              /*
              Loop through the results to find the object that is tagged with type 'Trailer'.
              note: this returns the final trailer in the video array.
              */
              let trailerVideo;
              videoData.results.forEach((video) => {
                if (video.type === 'Trailer') {
                  trailerVideo = video.key;
                }
              });

              extraMetaData = {
                title: movieData.title,
                overview: movieData.overview,
                rating: movieData.vote_average,
                image: `http://image.tmdb.org/t/p/w500${movieData.poster_path}`,
                youTubeVideoId: trailerVideo,
              };
              // this will overwrite the title from sf cinema city
              resolveVideoData(Object.assign(movie, extraMetaData));
            })
            .catch((error) => {
              rejectVideoData(error);
            });
          });
        }
        extraMetaData = {
          overview: 'No description available.',
          rating: 'unknown',
          image: '',
          youTubeVideoId: '',
        };

        return Promise.resolve(Object.assign(movie, extraMetaData));
      })
      .then((finalMovieObject) => {
        resolve(finalMovieObject);
      })
      .catch((err) => {
        reject(err);
      });
    });

    const moviesWithMetaData = [];
    for (const movieName of Object.keys(sfcinemacityMovieData)) {
      moviesWithMetaData.push(new Promise((resolve, reject) => {
        try {
          resolve(addMovieData(sfcinemacityMovieData[movieName]));
        } catch (err) {
          reject(err);
        }
      }));
    }

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
