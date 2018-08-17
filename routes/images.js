'use strict';

const express = require('express');
const knex = require('../knex');
const router = express.Router();

//const cloudinary = require('cloudinary');

/*get all images*/
router.get('/', (req,res,next) =>{
  knex.select()
    .from('images')
    .then(results =>{
      res.json(results);
    })
    .catch(err => next(err));
});



// /*get all images from a certain moodboard*/

router.get('/join/:id', (req,res,next) =>{
  const {id} = req.params;
  knex.select()
    .from('images_moodboard')
    .where('moodboard_id',id)
    .then(results =>{
      res.json(results);
    })
    .catch(err => next(err));
});





/*get particular image by id*/
router.get('/:id', (req,res,next) =>{
  const {id} = req.params;
  knex.select()
    .from('images')
    .where('id',id)
    .returning(['id','position','dimensions'])
    .then(([result]) =>{
      res.json(result);
    })
    .catch(err => next(err));
});



/*update/save image*/

router.put('/:id', (req,res,next) =>{
  
  const {id} = req.params;
  const {position, dimensions} = req.body;
  const updatedImage= {
    position,
    dimensions
  };

  knex.select()
    .from('images')
    .where('id',id)
    .update(updatedImage)
    .returning(['id','position','dimensions'])
    .then(([result]) =>{
      res.json(result);
    })
    .catch(err => next(err));
});



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





