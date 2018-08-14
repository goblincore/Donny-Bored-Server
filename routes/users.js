'use strict';

//Required
const express = require('express');
const router = express.Router();
const knex = require('../knex');
const hashPassword = require('../utils/helpers');

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



//Create a new User
// Post to register a new user
router.post('/', (req, res, next) => {
  const requiredFields = ['username', 'password','email'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  const stringFields = ['username', 'password','email'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }

  // If the username and password aren't trimmed we give an error.  Users might
  // expect that these will work without trimming (i.e. they want the password
  // "foobar ", including the space at the end).  We need to reject such values
  // explicitly so the users know what's happening, rather than silently
  // trimming them and expecting the user to understand.
  // We'll silently trim the other fields, because they aren't credentials used
  // to log in, so it's less of a problem.
  const explicityTrimmedFields = ['username', 'password'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
  }

  const sizedFields = {
    username: {
      min: 1
    },
    password: {
      min: 8,
      // bcrypt truncates after 72 characters, so let's not give the illusion
      // of security by storing extra (unused) info
      max: 72
    }
  };
  const tooSmallField = Object.keys(sizedFields).find(
    field =>
      'min' in sizedFields[field] &&
            req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      'max' in sizedFields[field] &&
            req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField]
          .min} characters long`
        : `Must be at most ${sizedFields[tooLargeField]
          .max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  let {username, password, email} = req.body;

  console.log(req.body);
  // Username and password 

  return knex
    .select()
    .from('users')
    .count('username')
    .where('username',username)
    .then(([_count]) => {
      const {count} = _count;
      console.log('Count',count);
      if (count > 0) {
        // There is an existing user with the same username
        console.log('username already taken');
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        });
      }
      // If there is no existing user, hash the password
      return hashPassword(password,10);
    })
    .then(hash => {
      const newUser={
        username,
        password: hash,
        email

      };

      return knex
        .insert(newUser)
        .select('users')
        .into('users')
        .returning(['username','id'])
        .then(([result]) => {
          res.status(201).json(result);

        })
        .catch(err => next(err));
    }).catch(err => {
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error'});
    });
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