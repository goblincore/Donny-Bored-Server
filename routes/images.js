'use strict';

const express = require('express');
const knex = require('../knex');
const router = express.Router();

//const cloudinary = require('cloudinary');






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


// var knex = require('knex'),
//     _ = require('underscore');

// function bulkUpdate (records) {
//       var updateQuery = [
//           'INSERT INTO mytable (primaryKeyCol, col2, colN) VALUES',
//           _.map(records, () => '(?)').join(','),
//           'ON DUPLICATE KEY UPDATE',
//           'col2 = VALUES(col2),',
//           'colN = VALUES(colN)'
//       ].join(' '),

//       vals = [];

//       _(records).map(record => {
//           vals.push(_(record).values());
//       });

//       return knex.raw(updateQuery, vals);
//  }



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





