'use strict';

//Required
const express = require('express');
const router = express.Router();
const knex = require('../knex');


//Get all Users

router.get('/', (req,res,next) =>{
  knex.select('id','username','email')
    .from('users')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

//Get user by ID
router.get('/:id', (req,res,next) => {
  const {id} = req.params;
  knex.select()
    .from('users')
    .where('id',id)
    .then(([user]) =>{
      if(user){
        res.json(user);
      } else{
        next();
      }
    })
    .catch(err => next(err));

});


//Update a user
router.put('/:id', (req,res,next) =>{
  
  const {id} = req.params;
  const {board_name} = req.body;
  const updatedUser= {
    board_name 
  };

  knex.select()
    .from('users')
    .where('id',id)
    .update(updatedUser)
    .returning(['id','email','password'])
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