'use strict';

const apiKey = '56d21064b7cc44009259fb9e42cb3962'

const searchURL = 'https://listen-api.listennotes.com/api/v2/search';

const recommendationURL = 'https://listen-api.listennotes.com/api/v2/podcasts/';



function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}


function displayResults(responseJson) {

  // if there are previous results, remove them
  $('.js-results').empty();
  // iterate through the articles array, stopping at the max number of results
  for (let i = 0; i < responseJson.results.length; i++) {
    // for each video object in the articles
    //array, add a list item to the results 
    //list with the article title, source, author,
    //description, and image

    $('.js-results').append(
      `
<div class="contain">
    <h2 class="js-name clearfix">${responseJson.results[i].title_original}</h2>
    <div class="js-info">
    <img class ="thumbnail" src='${responseJson.results[i].thumbnail}'>
        <p class="readmore-contain">${responseJson.results[i].description_original}</p>
        <a class = "learn-more-button" href='${responseJson.results[i].listennotes_url}'>Learn More</a>
        <button onclick="getRecommendations('${responseJson.results[i].id}')" class = "find-similar learn-more-button" value = ${responseJson.results[i].id}>Find Similar Podcasts</button>
        </div>
</div>
`
    )
  };


  //display the results section  
  $('.js-results').removeClass('hidden');


  //getRecommendations(findsimilar);
};

function getPodcasts(query) {
  const params = {
    q: query,
    type: "podcast",
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  console.log(url);

  const options = {
    headers: new Headers({
      "X-ListenAPI-Key": apiKey
    })
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

function getRecommendations(id) {
  
  const parameters = {
    id: id
  };

  const url = recommendationURL + id + '/recommendations?safe_mode=1';
  console.log(id);
  console.log(url);

  const options = {
    headers: new Headers({
      "X-ListenAPI-Key": apiKey
    })
  };

  fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayPodcastRecommendations(responseJson))
    .catch(err => {
      $('#js-warn').text(`Something went wrong`);
    });


}


function displayPodcastRecommendations(responseJson) {

  $(".find-similar").click(function () {
    $('.similar').empty();
    //alert('Hello world');
    console.log("id " + responseJson.id);
    let id = responseJson.recommendations.id;
    const url = recommendationURL + id + '/recommendations?safe_mode=1';
    $(this).closest('.contain').append(
      `
<div class="similar">
  <h2 class="js-name clearfix">${responseJson.recommendations[0].title}</h2>
  <div class="js-info">
  <img class ="thumbnail" src='${responseJson.recommendations[0].thumbnail}'>
      <p class="readmore-contain">${responseJson.recommendations[0].description}</p>
      <a class = "learn-more-button" href='${responseJson.recommendations[0].listennotes_url}'>Learn More</a>
  </div>
</div>
`
    )
    


  });
  
}
function findSimilarPodcasts(id) {

}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('.js-search-term').val();

    getPodcasts(searchTerm);

  });
}

$(watchForm);

