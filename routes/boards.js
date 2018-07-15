'use strict';

//Required
const express = require('express');
const router = express.Router();
const knex = require('../knex');



//Get all moodboards for a user

router.get('/', (req,res,next) => {
  const userId = req.query.user_id;

  knex.select('moodboards.id','board_name','user_id','users.username')
    .from('moodboards')
    .leftJoin('users','moodboards.user_id','users.id')
    .modify(function(queryBuilder){
      if(userId){
        queryBuilder.where('user_id',userId);
      }
    })
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});


//Get moodboard by ID
router.get('/:id', (req,res,next) => {
  const {id} = req.params;
  knex.select()
    .from('moodboards')
    .where('id',id)
    .then(([moodboard]) =>{
      if(moodboard){
        res.json(moodboard);
      } else{
        next();
      }
    })
    .catch(err => next(err));

});


//Update a moodboard
router.put('/:id', (req,res,next) =>{
  
  const {id} = req.params;
  const {board_name} = req.body;
  const updatedMoodboard = {
    board_name 
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
  const { board_name, user_id } = req.body;
  const newBoard = {
    board_name, user_id
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