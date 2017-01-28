/*
Get movie data for a particular movie title.
Currently accessing:
- OMDB (https://www.omdbapi.com/)
- The Movie DB (https://www.themoviedb.org/)
- Rotten Tomatoes (https://www.rottentomatoes.com/)
*/

/* eslint-disable max-len */

const rpn = require('request-promise-native');
const cheerio = require('cheerio');
// const Fuse = require('fuse.js'); // https://github.com/krisk/fuse

class MovieDatabases {

  /*
  Fetch movie data from The Movie DB.
  */
  static theMovieDB(movieTitle) {
    const theMovieDbBaseUrl = 'http://api.themoviedb.org/3';

    return new Promise((resolve, reject) => {
      const theMovieDbOptions = {
        uri: `${theMovieDbBaseUrl}/search/movie?query=${movieTitle}&api_key=${process.env.THE_MOVIE_DB_API_KEY}`,
        json: true,
      };

      const theMovieDbData = {
        overview: '',
        posterImage: '',
        trailer: '',
        runtime: '',
        title: movieTitle,
        tagline: '',
        imdbUrl: '',
        releaseDate: '',
      };

      rpn(theMovieDbOptions)
      .then((result) => {
        if (result.results.length > 0) {
          // Get the movie title with the closest fuzzy string match
          // const fuseOptions = {
          //   tokenize: true,
          //   matchAllTokens: true,
          //   keys: ['title'],
          // };

          // console.log(result.results);
          //
          //           const fuse = new Fuse(result.results, fuseOptions);
          //           const bestMatchingMovie = fuse.search(movieTitle)[0];
          // console.log(bestMatchingMovie);
          const bestMatchingMovie = result.results[0];

          theMovieDbData.overview = bestMatchingMovie.overview;
          theMovieDbData.posterImage = `https://image.tmdb.org/t/p/w500${bestMatchingMovie.poster_path}`;
          theMovieDbData.title = bestMatchingMovie.title;
          theMovieDbData.releaseDate = bestMatchingMovie.release_date;

          // Get the movie trailer for it
          theMovieDbOptions.uri = `${theMovieDbBaseUrl}/movie/${bestMatchingMovie.id}/videos?api_key=${process.env.THE_MOVIE_DB_API_KEY}&language=en-US`;
          rpn(theMovieDbOptions)
          .then((videoData) => {
            if (videoData.results.length > 0) {
              /*
              Loop through the results to find the object that is tagged with type 'Trailer'.
              note: this returns the final trailer in the video array.
              */
              videoData.results.forEach((video) => {
                if (video.type === 'Trailer') {
                  theMovieDbData.trailer = `https://www.youtube.com/watch?v=${video.key}`;
                }
              });
            }

            // now get other movie details
            theMovieDbOptions.uri = `${theMovieDbBaseUrl}/movie/${bestMatchingMovie.id}?api_key=${process.env.THE_MOVIE_DB_API_KEY}&language=en-US`;
            return rpn(theMovieDbOptions);
          })
          .then((movieData) => {
            theMovieDbData.runtime = movieData.runtime;
            theMovieDbData.tagline = movieData.tagline;
            theMovieDbData.imdbUrl = `http://www.imdb.com/title/${movieData.imdb_id}`;

            // now get the actors
            theMovieDbOptions.uri = `${theMovieDbBaseUrl}/movie/${bestMatchingMovie.id}/credits?api_key=${process.env.THE_MOVIE_DB_API_KEY}&language=en-US`;
            return rpn(theMovieDbOptions);
          })
          .then((actorData) => {
            const actors = [];
            const numCastListed = actorData.cast.length;
            for (let i = 0; (i < numCastListed) && (i < 5); i += 1) {
              const actor = actorData.cast[i];
              actors.push(`${actor.name} (${actor.character})`);
            }
            theMovieDbData.actors = actors.join(', ');
            resolve(theMovieDbData);
          })
          .catch((tmdError) => {
            reject(tmdError);
          });
        } else {
          resolve(theMovieDbData);
        }
      })
      .catch((error) => {
        reject(`Error getting data from The Movie DB: ${error}`);
      });
    });
  }

  /*
  Fetch a range of movie data from OMDB

  I tried adding releaseYear, but OMDb seems to return incorrect results with this sometimes.
  uri: `http://www.omdbapi.com/?t=${movieTitle}&plot=short&r=json&tomatoes=true&y=${releaseYear}`,
  */
  static omdb(movieTitle) {
    const checkForValue = value => ((value === 'N/A') ? '' : value);
    return new Promise((resolve, reject) => {
      const movieDbOptions = {
        uri: `http://www.omdbapi.com/?t=${movieTitle}&plot=short&r=json&tomatoes=true`,
        json: true,
      };

      const movieMetaData = {
        imdbRating: '',
        rottenTomatoesUrl: '',
      };

      rpn(movieDbOptions)
      .then((result) => {
        if (!result.Error) {
          movieMetaData.imdbRating = checkForValue(result.imdbRating);
          movieMetaData.rottenTomatoesUrl = checkForValue(result.tomatoURL);
        }
        resolve(movieMetaData);
      })
      .catch((err) => {
        reject(`Error grabbing data from omdb: ${err}`);
      });
    });
  }

  /*
  Fetch data from Rotten Tomatoes itself.
  */
  static rottenTomatoes(rottenTomatoesUrl) {
    const rottenTomatoesMetaData = {
      tomatoMeter: '',
      tomatoConsensus: '',
    };

    if (!rottenTomatoesUrl) {
      return Promise.resolve(rottenTomatoesMetaData);
    }

    return new Promise((resolve, reject) => {
      const options = {
        uri: rottenTomatoesUrl,
        transform: body => cheerio.load(body),
      };

      rpn(options)
      .then(($) => {
        rottenTomatoesMetaData.tomatoMeter = $('#all-critics-numbers .meter-value span').text();
        rottenTomatoesMetaData.tomatoConsensus = $('#all-critics-numbers .critic_consensus').text().replace('Critics Consensus:', '').trim();
        resolve(rottenTomatoesMetaData);
      })
      .catch((err) => {
        reject(`Error grabbing data from Rotten Tomatoes: ${err}`);
      });
    });
  }
}

module.exports = MovieDatabases;
