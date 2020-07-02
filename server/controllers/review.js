const Review = require('../models/review');
const Booking = require('../models/booking');
const moment = require('moment');
const mongoose = require('mongoose');

const { normalizeErrors } = require('../helpers/mongoose');
const rental = require('../models/rental');


exports.getReviews = function (req, res) {
  const { rentalId } = req.query;
  Review.find({ 'rental': rentalId })
    .populate('user')
    .populate('booking startAt endAt')
    .exec((err, reviews) => {

      if (err) {
        return res.status(422).send({ errors: normalizeErrors(err.errors) });
      }
      return res.json(reviews);
    });
}

exports.createReview = function (req, res) {
  const reviewData = req.body;
  const { bookingId } = req.query;
  const user = res.locals.user;

  Booking.findById(bookingId)
    .populate({ path: 'rental', populate: { path: 'user' } })
    .populate('review')
    .populate('user')
    .exec(async (err, foundBooking) => {

      if (err) {
        return res.status(422).send({ errors: normalizeErrors(err.errors) });
      }

      if (!foundBooking) {
        return res.status(422).send({ errors: [{ title: 'Invalid booking!', detail: 'Booking does not exist!' }] });
      }

      const { rental } = foundBooking;

      if (rental.user.id === user.id) {
        return res.status(422).send({ errors: [{ title: 'Invalid User!', detail: 'Cannot create review on your Rental!' }] });
      }

      const foundBookingUserId = foundBooking.user.id;

      if (foundBookingUserId !== user.id) {
        return res.status(422).send({ errors: [{ title: 'Invalid User!', detail: 'Cannot write review on someone else booking' }] });
      }

      const timeNow = moment();
      const endAt = moment(foundBooking.endAt);

      // if (!endAt.isBefore(timeNow)) {
      //    return res.status(422).send({errors: [{title: 'Invalid Date!', detail: 'You can place the review only after your trip is finished'}]});
      // }

      if (foundBooking.review) {
        return res.status(422).send({ errors: [{ title: 'Booking Error!', detail: 'Only one review per booking is allowed!' }] });
      }

      const review = new Review(reviewData);
      review.user = user;
      review.rental = rental;
      review.booking = foundBooking;

      Review.create(review, (err, newReview) => {
        if (err) {
          return res.status(422).send({ errors: [{ title: 'Rental error', detail: 'Could not create rental.' }] });
        }
        Booking.update({ _id: foundBooking.id }, { $push: { review: newReview } });
        return res.json(newReview);
      })
    });
}


exports.getRentalRating = function (req, res) {
  const rentalId = req.params.id;

  Review.aggregate()
    .match({ rental: mongoose.Types.ObjectId(rentalId) })
    // .unwind('$rental')
    .group({
      _id: null,
      average: { $avg: '$rating' }
    })
    .exec(function (err, result) {
      if (err) {
        return res.status(422).send({ errors: normalizeErrors(err.errors) });
      }
      if (result[0]) {
        return res.json(result[0]['average'])
      }

      return res.json(null)
    });
  // Review.aggregate([
  //   // {
  //   //   $match: { $rental: rentalId }
  //   // },
  //   {
  //     $group: {
  //       _id: null,
  //       average: { $avg: '$rating' }
  //     }
  //   }], function (err, result) {
  //     if (err) {
  //       return res.status(422).send({ errors: normalizeErrors(err.errors) });
  //     }
  //     if (result[0]) {
  //       return res.json(result[0]['average'])
  //     }

  //     return res.json(null)
  //   })
}










