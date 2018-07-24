'use strict';

//Required depndencies
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const {PORT}=require('./config');


//Routers
const moodboardsRouter = require('./routes/boards');
const imagesRouter = require('./routes/images');
const usersRouter = require('./routes/users');
const cloudRouter = require('./routes/cloud');

//Creation of express app
const app = express();

//Log all requests
app.use(morgan('dev'));

//Create a Static Webserver
app.use(express.static('public'));

//Enable CORS support
app.use(cors());

//Parse request body
app.use(express.json());

//Mount our routers on desired path
app.use('/api/moodboards', moodboardsRouter);
app.use('/api/users',usersRouter);
app.use('/api/images',imagesRouter);
app.use('/api/cloudinary',cloudRouter);


// Custom 404 Not Found route handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});
  
// Custom Error Handler
app.use((err, req, res, next) => {
  if (err.status) {
    const errBody = Object.assign({}, err, { message: err.message });
    res.status(err.status).json(errBody);
  } else {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Listen for incoming connections
app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});
  