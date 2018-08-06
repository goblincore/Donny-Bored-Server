'use strict';

function hydrate(input) {
  const hydrated = [], lookup = {};
  for (let moodboard of input) {
    if (!lookup[moodboard.id]) {
      lookup[moodboard.id] = moodboard;
      lookup[moodboard.id].images = [];
      hydrated.push(lookup[moodboard.id]);
    }
  
    if (moodboard.imageId && moodboard.imageUrl && moodboard.imagePosition && moodboard.imageDimensions ) {
      lookup[moodboard.id].images.push({
        id: moodboard.imageId,
        imageurl: moodboard.imageUrl,
        position:moodboard.imagePosition,
        dimensions: moodboard.imageDimensions
      });
    }
    delete lookup[moodboard.id].imageId;
    delete lookup[moodboard.id].imagePosition;
    delete lookup[moodboard.id].imageDimensions;
    delete lookup[moodboard.id].imageUrl;
  }
  return hydrated;
}


module.exports = hydrate;