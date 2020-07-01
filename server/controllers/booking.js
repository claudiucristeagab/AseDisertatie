const config = require('../config/config.development');

const BookingModel = require('../models/booking');
const RentalModel = require('../models/rental');
const UserModel = require('../models/user');
const PaymentModel = require('../models/payment');
const mongooseHelper = require('../helpers/mongoose');
const { logger } = require('../services/logger')
const moment = require('moment');
const stripe = require('stripe')(config.STRIPE_SECRET_KEY);

exports.createBooking = (req, res) => {
    const { startAt, endAt, totalPrice, guests, days, rental, paymentToken } = req.body;
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
        .exec(async (err, foundRental) => {
            if (err) {
                return res.status(422).send({ errors: mongooseHelper.normalizeErrors(err.errors) });
            }
            if (foundRental.user.id === user.id) {
                return res.status(422).send({
                    errors: [{
                        title: 'Invalid booking!',
                        detail: 'Cannot book your own rental.'
                    }]
                });
            }
            if (!validateBooking(booking, foundRental)) {
                return res.status(422).send({
                    errors: [{
                        title: 'Invalid booking!',
                        detail: 'Chosen dates are already taken.'
                    }]
                });
            }
            if (booking.guests === 0) {
                return res.status(422).send({
                    errors: [{
                        title: 'Invalid booking!',
                        detail: 'You must book at least one guest.'
                    }]
                });
            }

            booking.user = user;
            booking.rental = foundRental;

            const { payment, err: paymentErr } = await createPayment(booking, foundRental.user, paymentToken);
            if (paymentErr) {
                return res.status(422).send({
                    errors: [{
                        title: 'Invalid payment!',
                        detail: paymentErr
                    }]
                });
            }

            booking.payment = payment;
            foundRental.bookings.push(booking);

            booking.save((err) => {
                if (err) {
                    return res.status(422).send({ errors: mongooseHelper.normalizeErrors(err.errors) });
                }
                foundRental.save((err) => {
                    if (err) {
                        return res.status(422).send({ errors: mongooseHelper.normalizeErrors(err.errors) });
                    }
                    UserModel.update({ _id: user.id }, { $push: { bookings: booking } }, (err) => {
                        if (err) {
                            return res.status(422).send({ errors: mongooseHelper.normalizeErrors(err.errors) });
                        }
                        return res.json({ startAt: booking.startAt, endAt: booking.endAt });
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
    if (rental.bookings && rental.bookings.length > 0) {
        isValid = rental.bookings.every((x) => {
            const proposedStart = moment(booking.startAt);
            const proposedEnd = moment(booking.endAt);
            const actualStart = moment(x.startAt);
            const actualEnd = moment(x.endAt);

            if ((actualStart < proposedStart && actualEnd < proposedStart)
                || (proposedEnd < actualEnd && proposedEnd < actualStart)) {
                return true;
            }
            else {
                return false;
            }
        })
    }
    return isValid;
}
const createPayment = async (booking, toUser, token) => {
    const { user: fromUser } = booking;
    
    let customer = {};

    if (fromUser.stripeCustomerId){
        customer = await stripe.customers.retrieve(fromUser.stripeCustomerId);
        logger.info(`User with id ${fromUser.id} has Stripe customer Id ${customer.id}`);
    }
    else {
        customer = await stripe.customers.create({
            source: token,
            email: fromUser.email
        })
        logger.info(`User with id ${fromUser.id} was assigned Stripe customer Id ${customer.id}`);
    }

    if (customer) {
        UserModel.update({ _id: fromUser.id }, { $set: { stripeCustomerId: customer.id } }, () => { });
        const payment = new PaymentModel({
            fromUser,
            fromStripeCustomerId: customer.id,
            toUser,
            booking,
            amount: booking.totalPrice * 100 * config.CUSTOMER_SHARE, // stripe does not support decimals (cents), then my share
            tokenId: token
        });
        try {
            const savedPayment = await payment.save();
            return {
                payment: savedPayment
            }
        }
        catch (err) {
            return {
                err: err.message
            }
        }
    }
    else {
        return {
            err: 'Cannot process payment.'
        }
    }
}