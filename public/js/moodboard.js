/* global $ store api moment*/
'use strict';

const moodboard = (function () {

  function render() {
    const imagesList = generateImagesList(store.images, store.currentQuery);
    $('.js-images-list').html(imagesList);
    console.log('render');
  }

  function generateImagesList(list, currQuery) {

    console.log('LIST' + list.length);
    const listItems = list.map(item => `<div class="col-xs-6 col-md-4 thumbnail"><img src="uploads/${item.imageurl}" ></div>`);
    return listItems.join('');
  }


  function handleNewImageSubmit(){
    $('.js-new-image-form').on('submit', event => {
      event.preventDefault(); 
      console.log('CLICK HANDLER WORK');
    

    });
  }

  function bindEventListeners() {
  //event handlers added here
    handleNewImageSubmit();
  }
    
  // This object contains the only exposed methods from this module:
  return {
    render: render,
    bindEventListeners: bindEventListeners,
  };
    
}());