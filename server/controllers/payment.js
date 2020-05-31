const UserModel = require('../models/user');
const PaymentModel = require('../models/payment');
const mongooseHelper = require('../helpers/mongoose');
const stripe = require('stripe');
const config = require('../config/config.development');

exports.getPendingPayments = (req, res) => {
    const user = res.locals.user;

    PaymentModel
        .where({
            toUser: user
        })
        .populate('booking')
        .populate('rental')
        .populate('fromUser')
        .exec((err, foundPayments) => {
            if (err) {
                return res.status(422).send({ errors: mongooseHelper.normalizeErrors(err.errors) });
            }
            return res.json(foundPayments);
        })
}