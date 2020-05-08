const BookingModel = require('../models/booking');
const RentalModel = require('../models/rental');
const UserModel = require('../models/user');
const mongooseHelper = require('../helpers/mongoose');
const moment = require('moment');

exports.createBooking = (req,res) => {
    const {startAt, endAt, totalPrice, guests, days, rental } = req.body;
    const user = res.locals.user;
    const booking = new BookingModel({
        startAt,
        endAt,
        totalPrice,
        guests,
        days
    });

    RentalModel.findById(rental._id)
    .populate('bookings')
    .populate('user')
    .exec((err, foundRental) => {
        if (err) {
            return res.status(422).send({errors: mongooseHelper.normalizeErrors(err.errors)});
        }
        if (foundRental.user.id === user.id){
            return res.status(422).send({errors: [{title: 'Invalid user!', 
                detail: 'Cannot book your own rental.'}]});
        }
        if (!validateBooking(booking, foundRental)){
            return res.status(422).send({errors: [{title: 'Invalid booking!', 
                detail: 'Chosen dates are already taken.'}]});
        }
        if (booking.guests === 0 ){
            return res.status(422).send({errors: [{title: 'Invalid booking!', 
                detail: 'You must book at least one guest.'}]});
        }
        booking.user = user;
        booking.rental = foundRental;
        foundRental.bookings.push(booking);

        booking.save((err)=> {
            if (err) {
                return res.status(422).send({errors: mongooseHelper.normalizeErrors(err.errors)});
            }
            foundRental.save((err)=> {
                if (err) {
                    return res.status(422).send({errors: mongooseHelper.normalizeErrors(err.errors)});
                }
                UserModel.update({_id: user.id}, {$push: {bookings: booking}},(err) => {
                    if (err) {
                        return res.status(422).send({errors: mongooseHelper.normalizeErrors(err.errors)});
                    }
                    return res.json({startAt: booking.startAt, endAt: booking.endAt});
                });
            });
        });
    })
}
exports.getUserBookings = (req, res) => {
    const user = res.locals.user;
    BookingModel.where({ user: user })
        .populate('rental')
        .exec((err, foundBookings) => {
            if (err) {
                return res.status(422).send({ errors: mongooseHelper.normalizeErrors(err.errors) });
            }
            return res.json(foundBookings);
        })
}

const validateBooking = (booking, rental) => {
    let isValid = true;
    if(rental.bookings && rental.bookings.length >0){
        isValid = rental.bookings.every((x) => {
            const proposedStart = moment(booking.startAt);
            const proposedEnd = moment(booking.endAt);
            const actualStart = moment(x.startAt);
            const actualEnd = moment(x.endAt);

            if((actualStart < proposedStart && actualEnd < proposedStart)
            || (proposedEnd < actualEnd && proposedEnd < actualStart)){
                return true;
            }
            else{
                return false;
            }
        })
    }
    return isValid;
}