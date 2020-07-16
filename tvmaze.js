"use strict"
/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default image if no image exists,
           (image isn't needed until later)>
      }
 */
const BASE_URL = 'http://api.tvmaze.com'
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove hard coded data.
  let response = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`);
  let shows = [];
  for (let i = 0; i < response.data.length; i++) {
    let obj = {};
    // shows.push(let { id, name, summary, image } = response.data[i].show);
    obj["id"] = response.data[i].show.id;
    obj["name"] = response.data[i].show.name;
    obj["summary"] = response.data[i].show.summary;
    obj["image"] = response.data[i].show.image?.original;
    shows.push(obj);
  }
  // console.log('shows array', shows)
  return shows;

  /*return [
    {
      id: 1767,
      name: "The Bletchley Circle",
      summary:
        `<p><b>The Bletchley Circle</b> follows the journey of four ordinary 
           women with extraordinary skills that helped to end World War II.</p>
         <p>Set in 1952, Susan, Millie, Lucy and Jean have returned to their 
           normal lives, modestly setting aside the part they played in 
           producing crucial intelligence, which helped the Allies to victory 
           and shortened the war. When Susan discovers a hidden code behind an
           unsolved murder she is met by skepticism from the police. She 
           quickly realises she can only begin to crack the murders and bring
           the culprit to justice with her former friends.</p>`,
      image: "http://static.tvmaze.com/uploads/images/medium_portrait/147/369403.jpg"
    }
  ]*/
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();
  const URL = "https://tinyurl.com/tv-missing";

  for (let show of shows) {
    // console.log("image : ", show.image);
    let { id, name, summary, image } = show
    // image = image === undefined ? URL : image;
    image = image || URL;
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${id}">
         <div class="card" data-show-id="${id}">
           <div class="card-body">
             <h5 class="card-title">${name}</h5>
             <p class="card-text">${summary}</p>
             <img class="card-img-top" src="${image}">
             <button class='episodesButton'>Episodes</button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

async function doAndShowSearch() {
  let query = $("#search-query").val();
  if (!query) return;

  
  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
}

$("#search-form").on("submit", function (evt) {
  evt.preventDefault();
  doAndShowSearch();
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

  // TODO: return array-of-episode-info, as described in docstring above
  let episodeResponse = await axios.get(`${BASE_URL}/shows/${id}/episodes`);
  // console.log(episodeResponse);
  return episodeResponse.data.map((episode) => {
    const { id, name, season, number } = episode;
    return {id, name, season, number}
  })

  // let episodes = [];
  // for (let i = 0; i < episodeResponse.data.length; i++){
  //   let obj = {};
  //   obj['id'] = episodeResponse.data[i].id;
  //   obj['name'] = episodeResponse.data[i].name;
  //   obj['season'] = episodeResponse.data[i].season;
  //   obj['number'] = episodeResponse.data[i].number;
  //   episodes.push(obj);
  // }
  // console.log('episodes array', episodes);
  return episodes;
}

function populateEpisodes(episodes) {
  // console.log('episodes argument', episodes);
  $("#episodes-area").show();
  let $episodeList = $("#episodes-list");
  //loop through episodes array
  for(let episode of episodes) {
    let { id, name, season, number } = episode;
    let $episodeInfo = $("<li>").text(`ID: ${id}, Name: ${name} Season: ${season} Number: ${number}`);
    // console.log($episodeInfo);
    $episodeList.append($episodeInfo);
  }
  // create li element
  // put episode info in li element
  // append li to $episodeList
}

$("#shows-list")
  .on('click', '.episodesButton', async function(evt) {
    let episodeId = $(evt.target).closest($('.card')).data('showId');
    // console.log(id);
    let episodes = await getEpisodes(episodeId);
    populateEpisodes(episodes);
  });