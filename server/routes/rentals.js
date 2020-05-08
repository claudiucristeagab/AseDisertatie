const express = require('express');
const router = express.Router();
const RentalModel = require('../models/rental');
const UserModel = require('../models/user');
const UserController = require('../controllers/user');
const { logger } = require('../services/logger')

router.get('/secret', UserController.authMiddleware, function (req, res) {
    res.json({ "secret": true });
})

router.get('', function (req, res) {
    const searchString = req.query.search;

    if (searchString) {
        logger.info('Rentals route - Searching for rentals: ' + searchString);
        let splitStrings = searchString.split(' ');

        const query = splitStrings
            .map(x => {
                return '"' + x + '"';
            })
            .join(' ');
        RentalModel.find({
            $text: {
                $search: query,
                $caseSensitive: false
            }
        })
            .select('-bookings')
            .exec((err, foundRentals) => {
                if (err) {
                    return res.status(422).send({ errors: mongooseHelper.normalizeErrors(err.errors) });
                }
                if (foundRentals.length === 0) {
                    return res.status(422).send({
                        errors: [{
                            title: 'No rentals found!',
                            detail: `There are no rentals for ${query}`
                        }]
                    });
                }
                return res.json(foundRentals);
            });
    }
    else {
        logger.info('Loading all rentals', searchString);
        RentalModel.find({})
            .select('-bookings')
            .exec((err, foundRentals) => {
                if (err) {
                    return res.status(422).send({ errors: mongooseHelper.normalizeErrors(err.errors) });
                }
                if (foundRentals.length === 0) {
                    return res.status(422).send({
                        errors: [{
                            title: 'No rentals found!',
                            detail: `There are no rentals.`
                        }]
                    });
                }
                return res.json(foundRentals);
            });
    }
})

router.get('/manage', UserController.authMiddleware, (req, res) => {
    const user = res.locals.user;
    RentalModel.where({ user: user })
        .populate('bookings')
        .exec((err, foundRentals) => {
            if (err) {
                return res.status(422).send({ errors: mongooseHelper.normalizeErrors(err.errors) });
            }
            return res.json(foundRentals);
        })
})

router.get('/:id', function (req, res) {
    const id = req.params.id;
    RentalModel.findById(id)
        .populate('user', 'username email -_id')
        .populate('bookings', 'startAt endAt -_id')
        .exec((err, foundRental) => {
            if (err) {
                res.status(422).send({ errors: [{ title: 'Rental error', detail: 'Could not find rental.' }] });
            }
            return res.json(foundRental);
        });
})

router.post('', UserController.authMiddleware, function (req, res) {
    const { title, country, city, street, address, category, image, bedrooms, beds, guests, description, dailyRate }
        = req.body;
    const user = res.locals.user;
    const rental = new RentalModel(
        {
            title, country, city, street, address, category, image, bedrooms, beds, guests, description, dailyRate
        });
    rental.user = user;
    RentalModel.create(rental, (err, newRental) => {
        if (err) {
            res.status(422).send({ errors: [{ title: 'Rental error', detail: 'Could not find rental.' }] });
        }
        UserModel.update({ _id: user.id }, { $push: { rentals: newRental } });
        return res.json(newRental);
    })
})

router.delete('/:id', UserController.authMiddleware, function (req, res) {
    const user = res.locals.user;
    const id = req.params.id;
    RentalModel.findById(id)
        .populate('user', '_id')
        .populate({
            path: 'bookings',
            select: 'startAt',
            match: { startAt: { $gt: new Date() } } // active bookings
        })
        .exec((err, foundRental) => {
            if (err) {
                return res.status(422).send({ errors: mongooseHelper.normalizeErrors(err.errors) });
            }
            if (user.id !== foundRental.user.id) {
                res.status(422).send({ errors: [{ title: 'Invalid user', detail: 'Cannot delete a rental that you do not own.' }] });
            }
            if (foundRental.bookings.length > 0) {
                res.status(422).send({ errors: [{ title: 'Active bookings', detail: 'Cannot delete a rental with active bookings.' }] });
            }
            foundRental.remove((err) => {
                if (err) {
                    return res.status(422).send({ errors: mongooseHelper.normalizeErrors(err.errors) });
                }
                return res.json({ 'status': 'deleted' });
            })
        })
})

module.exports = router;