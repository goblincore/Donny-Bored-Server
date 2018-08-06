'use strict';
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const config = require('../config');
const router = express.Router();

const createAuthToken = function(user) {
   
  return jwt.sign({user}, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

function serialize(user){

  return {
    username: user.username || '',
    email: user.email|| '',
    id: user.id || ''
  };
}
const localAuth = passport.authenticate('local', {session: false});
router.use(express.json());
// The user provides a username and password to login
router.post('/login', localAuth, (req, res) => {
  console.log('LOGIN USER REQ',req.user);
  console.log('JWTSECRET',config.JWT_SECRET);

  const authToken = createAuthToken( serialize(req.user));
  res.json({authToken});
});



const jwtAuth = passport.authenticate('jwt', {session: false});

// The user exchanges a valid JWT for a new one with a later expiration
router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({authToken});
});

module.exports = {router};
