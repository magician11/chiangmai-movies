/*
Get movie data for a particular movie title.
Currently accessing:
- OMDB (https://www.omdbapi.com/)
- The Movie DB (https://www.themoviedb.org/)
*/

/* eslint-disable max-len */

const rpn = require('request-promise-native');
const Fuse = require('fuse.js'); // https://github.com/krisk/fuse

class MovieDatabases {
  /*
  Fetch movie data from The Movie DB.
  Currently only fetching a trailer associated to the supplied movie title.
  */
  theMovieDB(movieTitle) {
    const theMovieDbBaseUrl = 'http://api.themoviedb.org/3';

    return new Promise((resolve, reject) => {
      const theMovieDbOptions = {
        uri: `${theMovieDbBaseUrl}/search/movie?query=${movieTitle}&api_key=${process.env.THE_MOVIE_DB_API_KEY}`,
        json: true,
      };

      rpn(theMovieDbOptions)
      .then((result) => {
        if (result.results.length > 0) {
          // Get the movie title with the closest fuzzy string match
          const fuseOptions = {
            tokenize: true,
            matchAllTokens: true,
            keys: ['title'],
          };

          const fuse = new Fuse(result.results, fuseOptions);
          const bestMatchingMovie = fuse.search(movieTitle)[0];

          // Get the movie trailer for it
          theMovieDbOptions.uri = `${theMovieDbBaseUrl}/movie/${bestMatchingMovie.id}/videos?api_key=${process.env.THE_MOVIE_DB_API_KEY}&language=en-US`;
          rpn(theMovieDbOptions)
          .then((videoData) => {
            if (videoData.results.length > 0) {
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
              resolve(`https://www.youtube.com/watch?v=${trailerVideo}`);
            } else {
              resolve('');
            }
          })
          .catch((trailerError) => {
            reject(`Error grabbing trailer: ${trailerError}`);
          });
        } else {
          resolve('');
        }
      });
    });
  }

  /*
  Fetch a range of movie data from OMDB
  */
  omdb(movieTitle) {
    const checkForValue = (value) => ((value === 'N/A') ? '' : value);
    return new Promise((resolve, reject) => {
      const movieDbOptions = {
        // make sure to strip out any titles that end in ", A" or ", The"; omdb doesn't like it.
        uri: `http://www.omdbapi.com/?t=${movieTitle.split(',')[0]}&y=&plot=short&r=json&tomatoes=true`,
        json: true,
      };

      const movieMetaData = {
        title: '',
        overview: '',
        actors: '',
        imdbRating: '',
        tomatoMeter: '',
        tomatoConsensus: '',
        posterImage: '',
        imdbUrl: '',
        rottentomatoesUrl: '',
      };

      rpn(movieDbOptions)
      .then((result) => {
        if (!result.Error) {
          movieMetaData.title = checkForValue(result.Title);
          movieMetaData.overview = checkForValue(result.Plot);
          movieMetaData.actors = checkForValue(result.Actors);
          movieMetaData.imdbRating = checkForValue(result.imdbRating);
          movieMetaData.tomatoMeter = checkForValue(result.tomatoMeter);
          movieMetaData.tomatoConsensus = checkForValue(result.tomatoConsensus);
          movieMetaData.posterImage = checkForValue(result.Poster);
          movieMetaData.imdbUrl = (checkForValue(result.imdbID) !== '') ? `http://www.imdb.com/title/${result.imdbID}` : '';
          movieMetaData.rottentomatoesUrl = checkForValue(result.tomatoURL);
        }
        resolve(movieMetaData);
      })
      .catch((err) => {
        reject(`Error grabbing data from omdb: ${err}`);
      });
    });
  }

}

module.exports = new MovieDatabases();
