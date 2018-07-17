'use strict';

const express = require('express');
const knex = require('../knex');
const router = express.Router();
const multer = require('multer');


/*multer setup*/
//define our path for local storage
const storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/uploads');
  },
  filename: function (req, file, callback) {
    // console.log(file);
    //get the file mimetype ie 'image/jpg' split and prefer the second value ie'jpg'
    const ext = file.mimetype.split('/')[1];
    callback(null, file.fieldname + '-' + Date.now() + Math.floor(Math.random() * 6) + 1 +  '.'+ext);
  }
});


const upload = multer({ storage : storage }).array('photos',10);

/*--get--images--*/
router.get('/', (req, res, next) => {
  knex.select()
    .from('images')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

/*---get--individual image-----*/
router.get('/:id', (req, res, next) =>{
 
  const {id} = req.params;
  //const {imgurl, position, dimensions} = req.body;
 
  knex.select()
    .from('images')
    .where('id',id)
    .then(([results]) =>{
      if(results){
        res.json(results);

      }else{
        next();
      }
    })
    .catch(err => next(err));
      
});


/*create an image using post method*/

router.post('/', (req,res, next) => {
  //upload files to local storage
  upload(req,res,function(err) {
    console.log('THE BODY');
    //console.log(req.body);
    console.log(req.files);

    // if(!req.file){
    //   console.log('NO FILE');
    //  // return   res.status(400).end('NO FILE UPLOADED');
    // }

    if(err) {
      return res.end('Error uploading file.');
    }
    //then add url to database
    //const {imageurl, position=[], dimensions=[]} = req.body;
    const uploadedImages = req.files;
    const storeImageArray = [];

    uploadedImages.forEach( image => {
     
      const newImage = { 
        imageurl : `${image.filename}`, 
        position : [500,500], 
        dimensions : [100,100]
      };
      storeImageArray.push(newImage);

    });
  
    knex('images')
      .insert(storeImageArray)
      .returning(['id','imageurl','position','dimensions'])
      .then((results) =>{
    
        console.log('INSERTING NEW');
   
        //hmm
        // const newPicture = (newObject) => new Promise(r => insertInto(newObject));
        // const start = async () => {
        //   await Promise.all(results.forEach(async result => {
        //        const newObject = {
        //            image_id : result.id,
        //            moodboard_id : req.body.moodboard
        //        }

        //   //console.log('LOGGING IMAGE ID ASYNC' + newArray.length);
        //    newPicture(newObject);
          
        //   }))
        //   console.log('Done')
        // }
        // start();

        results.forEach( result => {
          const newObject = {
            image_id : result.id,
            moodboard_id : req.body.moodboard
          };
          console.log('FOR EACH' + result.id);
          insertInto(newObject);

        });

      
      
        console.log('this results' + results);


        res.status(201).json(results);  
     
        
      })
    
      .catch(err => next(err));
    
  });
  
});//end post

// /*async*/

function insertInto(insertObject){
  knex('images_moodboard')
    .insert(insertObject)
    .then(() => console.log('INSERTED BOTH IDS' +insertObject.image_id));
}

/*Delet an image*/

router.delete('/:id', (req,res, next) => {
  const {id} = req.params;

  knex('images')
    .where('id',id)
    .del()
    .then( () => res.sendStatus(204))
    .catch(err => next(err));
});




//EXPORT MODULE
module.exports = router;





