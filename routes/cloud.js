'use strict';
const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary');
const config = require('../config');
const cors = require('cors');
const knex = require('../knex');


//cloudinary config
cloudinary.config({
  cloud_name: config.CLOUDINARY_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage( {
  filename: function (req, file, callback) {
    console.log('TESTING MEMORY STORAGE' + file);
  }
});

// const upload = multer({ storage });
const upload = multer({ storage : storage }).single('file');

router.post('/', (req,res, next) => {
  console.log('COUDINARY TEST',cloudinary.config());
  //upload files to temp buffer
  upload(req,res,function(err) {
    console.log('Request files:');
    //console.log(req.body);
    console.log(req.file);
    console.log('IMAGE POSITION',req.body.positionX,req.body.positionY);

    if(req.body.positionX === null || undefined){
      return res.status(500).json({
        code: 500,
        reason: 'Invalid Position',
        message: 'Invalid position: expected integer',    
      });
    } 
    // Upload image on Cloudinary (using streams).
    cloudinary.v2.uploader
      .upload_stream({ resource_type: 'image' }, (error, result) => { 
        console.log(result);
       
        while(result.width > 500 || result.height > 600){
          result.width = Math.floor(result.width*0.5);
          result.height=Math.floor(result.height*0.5);
        } 
        //write to database
        const newImage = {
          imageurl : `${result.url}`, 
          position : [req.body.positionX,req.body.positionY], 
          dimensions : [`${result.width}`,`${result.height}`]
        };

        knex
          .insert(newImage)
          .into('images')
          .returning(['id','imageurl','position','dimensions'])
          .then(([result]) =>{
            console.log('testing insertion into database');
            const newObject = {
              image_id : result.id,
              moodboard_id : req.body.moodboard_id
            };
            knex('images_moodboard')
              .insert(newObject)
              .returning(['image_id','moodboard_id'])
              .then((result) => {
                console.log('INSERTED BOTH IDS' +newObject.image_id);
                res.status(201).json(result);
              }) 
              .catch(error => next(error)); 
          })
          .catch(error => next(error));            
      })
      .end(req.file.buffer);

  });
   
    
});//end post


function insertInto(insertObject){
  knex('images_moodboard')
    .insert(insertObject)
    .then(() => console.log('INSERTED BOTH IDS' +insertObject.image_id));
}
  

module.exports = router;