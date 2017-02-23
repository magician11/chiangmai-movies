/*
Get movie data for a particular movie title.
Currently accessing:
- Google (https://www.google.com/)
- The Movie DB (https://www.themoviedb.org/)
- Rotten Tomatoes (https://www.rottentomatoes.com/)
*/

/* eslint-disable max-len */

const rpn = require('request-promise-native');
const cheerio = require('cheerio');

class MovieDatabases {

  /*
  Fetch movie data from The Movie DB.
  */
  static theMovieDB(movieTitle, year = new Date().getFullYear()) {
    const theMovieDbBaseUrl = 'http://api.themoviedb.org/3';

    return new Promise((resolve, reject) => {
      const theMovieDbOptions = {
        uri: `${theMovieDbBaseUrl}/search/movie?query=${movieTitle}&api_key=${process.env.THE_MOVIE_DB_API_KEY}&year=${year}`,
        json: true,
      };

      const theMovieDbData = {
        overview: '',
        posterImage: '',
        trailer: '',
        runtime: '',
        title: movieTitle,
        tagline: '',
        releaseDate: '',
      };

      rpn(theMovieDbOptions)
      .then((result) => {
        if (result.results.length > 0) {
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
  Fetch data from Rotten Tomatoes itself.
  */
  static rottenTomatoes(movieTitle) {
    return new Promise((resolve, reject) => {
      // options for request promise native
      const options = {
        uri: '',
        transform: body => cheerio.load(body),
      };

      // first find the Rotten Tomatoes URL on google for this movie
      options.uri = `https://www.google.com/search?as_q=rotten+tomatoes+${movieTitle}`;
      rpn(options)

      // then extract it and grab that page from Rotten Tomatoes
      .then(($) => {
        const rottenTomatoesMatch = $('#search .g a').first().attr('href').match(/(https:\/\/www\.rottentomatoes\.com\/m.+)\/&sa/);
        if (!rottenTomatoesMatch) {
          resolve({ tomatoMeter: '', tomatoConsensus: '', rottenTomatoesUrl: '' });
        } else {
          const rottenTomatoesUrl = rottenTomatoesMatch[1];
          options.uri = rottenTomatoesUrl;
          rpn(options)
          .then((rtData) => {
            resolve({
              rottenTomatoesUrl,
              tomatoMeter: rtData('#all-critics-numbers .meter-value span').text(),
              tomatoConsensus: rtData('#all-critics-numbers .critic_consensus').text().replace('Critics Consensus:', '').trim(),
            });
          });
        }
      })
      .catch((err) => {
        reject(`Error grabbing data from Rotten Tomatoes: ${err}`);
      });
    });
  }
}

module.exports = MovieDatabases;
