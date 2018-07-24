'use strict';
const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary');

const knex = require('../knex');


//cloudinary config
cloudinary.config({
  cloud_name: 'moodimagescloud',
  api_key: '876357248326192',
  api_secret: 'xh8klIJpldYJNOJFG6lZO6fkbco',
});

const storage = multer.memoryStorage( {
  filename: function (req, file, callback) {
    console.log('TESTING MEMORY STORAGE' + file);
    //get the file mimetype ie 'image/jpg' split and prefer the second value ie'jpg'
    const ext = file.mimetype.split('/')[1];
    callback(null, file.fieldname + '-' + Date.now() + Math.floor(Math.random() * 6) + 1 +  '.'+ext);
  }
});
// const upload = multer({ storage });
const upload = multer({ storage : storage }).array('photos',10);

router.post('/', (req,res, next) => {
  //upload files to temp buffer
  upload(req,res,function(err) {
    console.log('Request files:');
    //console.log(req.body);
    console.log(req.files);
    // console.log('REQ FILE BUFFER TEST' + req.files[0].buffer);
    // const file = req.files[0];
    // Upload image on Cloudinary (using streams).
    req.files.forEach( file => {
      cloudinary.v2.uploader
        .upload_stream({ resource_type: 'image' }, (error, result) => { 
          console.log(result);

          //write to database
          const newImage = {
            imageurl : `${result.url}`, 
            position : [500,500], 
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
                }); 
            })
            .catch(err => next(err));            
        })
        .end(file.buffer);
    });
  });
   
    
});//end post


function insertInto(insertObject){
  knex('images_moodboard')
    .insert(insertObject)
    .then(() => console.log('INSERTED BOTH IDS' +insertObject.image_id));
}
  

module.exports = router;