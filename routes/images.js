'use strict';

const express = require('express');
const knex = require('../knex');
const router = express.Router();

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
  const {imageurl, position=[], dimensions=[]} = req.body;
  
  const newImage = { imageurl, position, dimensions};

  knex.insert(newImage)
    .into('images')
    .returning(['id','imageurl','position','dimensions'])
    .then((results) =>{
      const result = results[0];
      res.location(`${req.originalURL}${result.id}`).status(201).json(result);  
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





