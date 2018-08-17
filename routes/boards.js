'use strict';
// psql -U dev dev-moodboards-app
//Required
const express = require('express');
const router = express.Router();
const knex = require('../knex');
const hydrate = require('../utils/hydration');
const passport = require('passport');

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

//Get all moodboards and associated user and images

router.get('/', (req,res,next) => {
  const userId = req.query.user_id;
  console.log('THIS IS THE USER ID IMPORTANT',userId);

  knex
    .select('moodboards.id','board_name','user_id','description','users.username','images.id as imageId', 'images.imageurl as imageUrl')
    .from('moodboards')
    .leftJoin('users','moodboards.user_id','users.id')
    .leftJoin('images_moodboard','moodboards.id','images_moodboard.moodboard_id')
    .leftJoin('images','images_moodboard.image_id','images.id')
    .modify(function(queryBuilder){
      if(userId){
        queryBuilder.where('user_id',userId);
      }
    })
    .then(result => {
      if (result) {
        const hydrated = hydrate(result);
        res.json(hydrated);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});


//Get moodboard by ID and associated images
router.get('/:id', (req,res,next) => {
  const {id} = req.params;
  knex
    .select('moodboards.id','board_name','user_id','users.username','images.id as imageId', 'images.imageurl as imageUrl', 'images.position as imagePosition', 'images.dimensions as imageDimensions')
    .leftJoin('users','moodboards.user_id','users.id')
    .leftJoin('images_moodboard','moodboards.id','images_moodboard.moodboard_id')
    .leftJoin('images','images_moodboard.image_id','images.id')
    .from('moodboards')
    .where('moodboards.id',id)
    .then((result) => {
      if (result) {
        const hydrated = hydrate(result);
        res.json(hydrated);
      } else {
        next();
      }
    })
    .catch(err => next(err));

});


//Update a moodboard
router.put('/:id', (req,res,next) =>{
  console.log('UPDATE MOODBARD REQUEST',req);
  const {id} = req.params;
  const {board_name,description} = req.body;
  const updatedMoodboard = {
    board_name,
    description
  };

  knex.select()
    .from('moodboards')
    .where('id',id)
    .update(updatedMoodboard)
    .returning(['id','board_name','user_id'])
    .then(([result]) =>{
      res.json(result);
    })
    .catch(err => next(err));
});


//Create a Moodboard
router.post('/', (req,res,next) => {
  const { board_name, user_id, description } = req.body;
  const newBoard = {
    board_name, user_id, description
  };

  knex.insert(newBoard)
    .into('moodboards')
    .returning(['id','board_name','user_id'])
    .then(([result]) =>{
      res.json(result);
    })
    .catch(err => next(err));
});

//Delete a moodboard
router.delete('/:id', (req,res, next) => {
  const {id} = req.params;
  knex.del()
    .from('moodboards')
    .where('id',id)
    .then( () => res.status(204).end())
    .catch( err => next(err));
});

//EXPORT MODULE
module.exports = router;