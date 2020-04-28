const express = require('express');
const router = express.Router();
const RentalModel = require('../models/rental');
const UserController = require('../controllers/user');

router.get('/secret', UserController.authMiddleware, function(req,res){
    res.json({"secret": true});
})

router.get('', function(req,res){
    RentalModel.find({}, function(err, foundRentals){
        res.json(foundRentals);
    });
})

router.get('/:id', function(req,res){
    const id = req.params.id;
    RentalModel.findById(id, function(err, foundRental){
        if (err){
            res.status(422).send({errors: [{title: 'Rental error', detail: 'Could not find rental.'}]})
        }
        res.json(foundRental);
    });
})

module.exports = router;