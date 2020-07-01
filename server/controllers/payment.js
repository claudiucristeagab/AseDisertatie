const UserModel = require('../models/user');
const BookingModel = require('../models/booking');
const PaymentModel = require('../models/payment');
const RentalModel = require('../models/rental');
const mongooseHelper = require('../helpers/mongoose');
const config = require('../config/config.development');
const stripe = require('stripe')(config.STRIPE_SECRET_KEY);

exports.getPendingPayments = (req, res) => {
    const user = res.locals.user;

    PaymentModel
        .where({
            toUser: user
        })
        .populate({
            path: 'booking',
            populate: { path: 'rental' }
        })
        .populate('fromUser')
        .exec((err, foundPayments) => {
            if (err) {
                return res.status(422).send({ errors: mongooseHelper.normalizeErrors(err.errors) });
            }
            return res.json(foundPayments);
        })
}

exports.acceptPayment = function (req, res) {
    const { paymentId } = req.body;
    const user = res.locals.user;

    PaymentModel.findById(paymentId)
        .populate('toUser')
        .populate('booking')
        .exec(async function (err, foundPayment) {

            if (err) {
                return res.status(422).send({ errors: mongooseHelper.normalizeErrors(err.errors) });
            }

            if (foundPayment.status === 'pending' && user.id === foundPayment.toUser.id) {

                const booking = foundPayment.booking;

                const charge = await stripe.charges.create({
                    amount: booking.totalPrice * 100,
                    currency: 'usd',
                    customer: foundPayment.fromStripeCustomerId
                })

                if (charge) {
                    BookingModel.update({ _id: booking }, { status: 'active' }, function () { });

                    foundPayment.charge = charge;
                    foundPayment.status = 'paid';

                    foundPayment.save(function (err) {
                        if (err) {
                            return res.status(422).send({ errors: mongooseHelper.normalizeErrors(err.errors) });
                        }


                        UserModel.update({ _id: foundPayment.toUser }, { $inc: { revenue: foundPayment.amount } }, function (err, user) {
                            if (err) {
                                return res.status(422).send({ errors: mongooseHelper.normalizeErrors(err.errors) });
                            }

                            return res.json({ status: 'paid' });
                        })
                    })
                }
            }
        });
}

exports.declinePayment = function (req, res) {
    const { paymentId } = req.body;

    PaymentModel.findById(paymentId)
        .populate('booking')
        .exec((err, foundPayment) => {
            if (err) {
                return res.status(422).send({ errors: mongooseHelper.normalizeErrors(err.errors) });
            }

            const { booking } = foundPayment;

            foundPayment.status = 'declined';
            foundPayment.save(function (err) {
                if (err) {
                    return res.status(422).send({ errors: mongooseHelper.normalizeErrors(err.errors) });
                }

                BookingModel.update({ _id: booking._id }, { status: 'declined' }, (err, updatedBooking) => {
                    if (err) {
                        return res.status(422).send({ errors: mongooseHelper.normalizeErrors(err.errors) });
                    }
                    return res.json({ status: 'declined' });
                })
            })
        })
}
