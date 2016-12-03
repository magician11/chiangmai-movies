const rpn = require('request-promise-native');

class MovieDatabases {

  theMovieDB(movieTitle) {
    return new Promise((resolve, reject) => {
      resolve(movieTitle);
    });
  }

  omdb(movieTitle) {
    const checkForValue = (value) => ((value === 'N/A') ? '' : value);
    return new Promise((resolve, reject) => {
      const movieDbOptions = {
        // make sure to strip out any titles that end in ", A" or ", The"; omdb doesn't like it.
        uri: `http://www.omdbapi.com/?t=${movieTitle.split(',')[0]}&y=&plot=short&r=json&tomatoes=true`,
        json: true,
      };

      rpn(movieDbOptions)
      .then((result) => {
        if (!result.Error) {
          resolve({
            title: checkForValue(result.Title),
            overview: checkForValue(result.Plot),
            actors: checkForValue(result.Actors),
            imdbRating: checkForValue(result.imdbRating),
            tomatoMeter: checkForValue(result.tomatoMeter),
            tomatoConsensus: checkForValue(result.tomatoConsensus),
            posterImage: checkForValue(result.Poster),
            imdbUrl: (checkForValue(result.imdbID) !== '') ? `http://www.imdb.com/title/${result.imdbID}` : '',
            rottentomatoesUrl: checkForValue(result.tomatoURL),
          });
        } else {
          resolve({});
        }
      })
      .catch((err) => {
        reject(`Error grabbing data from omdb: ${err}`);
      });
    });
  }

}

module.exports = new MovieDatabases();
