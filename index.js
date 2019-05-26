'use strict';

const apiKey = '56d21064b7cc44009259fb9e42cb3962'

const searchURL = 'https://listen-api.listennotes.com/api/v2/search';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $('.js-results').empty();
  // iterate through the articles array, stopping at the max number of results
  for (let i = 0; i < responseJson.results.length; i++){
    // for each video object in the articles
    //array, add a list item to the results 
    //list with the article title, source, author,
    //description, and image
    $('.js-results').append(
        `
<div class="contain">
    <p class="js-name clearfix">${responseJson.results[i].title_original}</p>
    <div class="js-info">
    <img src='${responseJson.results[i].thumbnail}'>
        <span class="readmore-contain">${responseJson.results[i].description_original}</span>
        <a class = "learn-more-button" href='${responseJson.results[i].listennotes_url}'>Learn More</a>
    </div>
</div>
`
    )};
   
  //display the results section  
  $('.js-results').removeClass('hidden');
};

function getNews(query) {
  const params = {
    q: query,
    type: "podcast",
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  console.log(url);

  const options = {
    headers: new Headers({
      "X-ListenAPI-Key": apiKey})
  };

  fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-warn').text(`Something went wrong`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('.js-search-term').val();
  
    getNews(searchTerm);
  });
}

$(watchForm);
