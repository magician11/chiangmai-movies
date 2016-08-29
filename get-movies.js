const request = require('request');
const cheerio = require('cheerio');

const movieData = {
  ccode: 'CMIVIS2K',
  mcode: '',
  submit: {
    x: 46,
    y: 6,
  },
  submit: 'submit'
};


request.post({url:'http://www.sfcinemacity.com/index.php/en/timetable/lookup', form: movieData}, function(err,httpResponse,body) {
  const $ = cheerio.load(body);

  $(".content_list > li").each(function() {
    const movie = $(this).find('h3 > a').text();
    console.log(movie);
  });
});
