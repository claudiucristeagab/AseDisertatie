const express = require('express');
const router = express.Router();
const RentalModel = require('../models/rental');
const UserController = require('../controllers/user');

router.get('/secret', UserController.authMiddleware, function(req,res){
    res.json({"secret": true});
})

router.get('', function(req,res){
    RentalModel.find({})
        .select('-bookings')
        .exec((err, foundRental) => {
            return res.json(foundRental);
        });
})

router.get('/:id', function(req,res){
    const id = req.params.id;
    RentalModel.findById(id)
        .populate('user','username email -_id')
        .populate('bookings', 'startAt endAt -_id')
        .exec((err, foundRental) => {
            if (err){
                res.status(422).send({errors: [{title: 'Rental error', detail: 'Could not find rental.'}]})
            }
            return res.json(foundRental);
        });
})

module.exports = router;