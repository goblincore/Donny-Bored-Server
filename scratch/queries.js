'use strict';

const knex = require('../knex');

//Get all boards that match a search term
let searchTerm = 'Blue';
knex
  .select('moodboards.id', 'board_name', 'user_id')
  .from('moodboards')
  .modify(queryBuilder => {
    if (searchTerm) {
      queryBuilder.where('board_name', 'like', `%${searchTerm}%`);
    }
  })
  .orderBy('moodboards.id')
  .then(results => {
    console.log(JSON.stringify(results, null, 2));
  })
  .catch(err => {
    console.error(err);
  });

//Get a note by ID - accepts ID and returns the moodboard as an object
let searchId = 2;

knex
  .select('moodboards.id','board_name','user_id')
  .from('moodboards')
  .where('id',`${searchId}`)
  .then( ([item]) => {
    console.log(item);
  });