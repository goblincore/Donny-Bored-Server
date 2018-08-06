/* global $ moodboard api store */
'use strict';

$(document).ready(function () {
  moodboard.bindEventListeners();

  //   api.search('/api/images')
  //     .then(response => {
  //       store.images = response;
  //       console.log(response);
  //       noteful.render();
  //     });

  api.search('/api/moodboards/1')
    .then(([response]) => {
      console.log('PAGE INITIAL RENDER LOAD');
      store.images = response.images;
      console.log(response.images);
      moodboard.render();
    });

});