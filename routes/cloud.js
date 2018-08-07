'use strict';
const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary');
const config = require('../config');
const cors = require('cors');
const knex = require('../knex');


const {CLIENT_ORIGIN}=require('../config');
router.use(cors({
  origin: CLIENT_ORIGIN
}));


//cloudinary config
cloudinary.config({
  cloud_name: config.CLOUDINARY_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage( {
  filename: function (req, file, callback) {
    console.log('TESTING MEMORY STORAGE' + file);
    //get the file mimetype ie 'image/jpg' split and prefer the second value ie'jpg'
    // const ext = file.mimetype.split('/')[1];
    // callback(null, file.fieldname + '-' + Date.now() + Math.floor(Math.random() * 6) + 1 +  '.'+ext);
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

    console.log('REQBODY',req.body);
    // console.log('REQ FILE BUFFER TEST' + req.files[0].buffer);
    // const file = req.files[0];
    // Upload image on Cloudinary (using streams).
    // req.files.forEach( file => {
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
      .end(req.file.buffer);
    // });
  });
   
    
});//end post


function insertInto(insertObject){
  knex('images_moodboard')
    .insert(insertObject)
    .then(() => console.log('INSERTED BOTH IDS' +insertObject.image_id));
}
  

module.exports = router;