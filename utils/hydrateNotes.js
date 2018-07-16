'use strict';

function hydrateNotes(input) {
  const hydrated = [], lookup = {};
  for (let moodboard of input) {
    if (!lookup[moodboard.id]) {
      lookup[moodboard.id] = moodboard;
      lookup[moodboard.id].images = [];
      hydrated.push(lookup[moodboard.id]);
    }
  
    if (moodboard.imageId && moodboard.imageUrl) {
      lookup[moodboard.id].images.push({
        id: moodboard.imageId,
        imageurl: moodboard.imageUrl
      });
    }
    delete lookup[moodboard.id].imageId;
    delete lookup[moodboard.id].imageUrl;
  }
  return hydrated;
}


module.exports = hydrateNotes;