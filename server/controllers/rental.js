const RentalModel = require('../models/rental');
const UserModel = require('../models/user');
const BookingModel = require('../models/booking');
const ReviewModel = require('../models/review');
const { logger } = require('../services/logger')
const fs = require('fs');

const {PAGE_SIZE} = require('../config/config.development');
const mongooseHelper = require('../helpers/mongoose');

exports.getRentals = (req, res) => {
    const page = req.query.page;
    const searchedString = req.query.search;
    // const searchedUser = req.query.user;

    const query = {};
    if (searchedString) {
        let splitStrings = searchedString.split(' ');
        const searchText = splitStrings
            .map(x => {
                return '"' + x + '"';
            })
            .join(' ');
        query["$text"] = {
            $search: searchText,
            $caseSensitive: false
        }
    }
    // if (searchedUser) {
    //     query["user"] = ObjectId(searchedUser);
    // }
    let docsToSkip = 0;
    if(!!page){
        docsToSkip = PAGE_SIZE * (page-1);
    }

    RentalModel.find(query)
        .select('-bookings')
        .limit(PAGE_SIZE)
        .skip(docsToSkip)
        .exec((err, foundRentals) => {
            if (err) {
                return res.status(422).send({ errors: mongooseHelper.normalizeErrors(err.errors) });
            }
            if (foundRentals.length === 0) {
                return res.status(422).send({
                    errors: [{
                        title: 'No rentals found!',
                        detail: `There are no rentals for your current search.`
                    }]
                });
            }
            return res.json(foundRentals);
        });
}

exports.getRentalById = (req, res) => {
    const id = req.params.id;
    RentalModel.findById(id)
        .populate('user', 'username email -_id')
        .populate('bookings', 'startAt endAt -_id')
        .exec((err, foundRental) => {
            if (err) {
                return res.status(422).send({ errors: [{ title: 'Rental error', detail: 'Could not find rental.' }] });
            }
            return res.json(foundRental);
        });
}

exports.getRentalsByUser = (req, res) => {
    const user = res.locals.user;
    RentalModel.where({ user: user })
        .populate('bookings')
        .exec((err, foundRentals) => {
            if (err) {
                return res.status(422).send({ errors: mongooseHelper.normalizeErrors(err.errors) });
            }
            return res.json(foundRentals);
        })
}

exports.addRental = (req, res) => {
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
            return res.status(422).send({ errors: [{ title: 'Rental error', detail: 'Could not create rental.' }] });
        }
        UserModel.update({ _id: user.id }, { $push: { rentals: newRental } });
        return res.json(newRental);
    })
}

exports.deleteRental = (req, res) => {
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
                return res.status(422).send({ errors: [{ title: 'Invalid user', detail: 'Cannot delete a rental that you do not own.' }] });
            }
            if (foundRental.bookings.length > 0) {
                return res.status(422).send({ errors: [{ title: 'Active bookings', detail: 'Cannot delete a rental with active bookings.' }] });
            }
            foundRental.remove((err) => {
                if (err) {
                    return res.status(422).send({ errors: mongooseHelper.normalizeErrors(err.errors) });
                }
                const path = './public' + foundRental.image;
                fs.unlink(path, function (err) {
                    logger.info(`Deleting file: '${path}'`);
                    if (err) {
                        logger.error(err.message);
                    }
                    return res.json({ 'status': 'deleted' });
                });
            })
        })
}

exports.updateRental = (req, res) => {
    const id = req.params.id;
    const user = res.locals.user;
    const { title, country, city, street, address, category, image, bedrooms, beds, guests, description, dailyRate }
        = req.body;
    RentalModel.findOneAndUpdate({
        _id: id,
        user: {
            _id: user.id
        }
    },
        {
            title, description, country, city, street, address, category, bedrooms, beds, guests, dailyRate, image
        },
        ((err, foundRental) => {
            if (err) {
                return res.status(422).send({ errors: mongooseHelper.normalizeErrors(err.errors) });
            }
            if (foundRental.user.id !== user.id) {
                return res.status(422).send({ errors: [{ title: 'Invalid user', detail: 'Cannot modify a rental that you do not own.' }] });
            }
            return res.json(foundRental);
        }))
}
