import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, formatStripeAmount } from 'helpers';
import * as paymentStatus from 'models/paymentStatus';

export class PaymentCard extends React.Component {

    render() {
        const {booking, payment, paymentButtons} = this.props;
        return (
            <div className='col-md-4'>
                <div className='card text-center'>
                    <div className='card-header'>
                        Booked by {payment.fromUser.username}
                    </div>
                    <div className='card-block'>
                        <h4 className='card-title'> {booking.rental.title} - {booking.rental.city}, {booking.rental.country}</h4>
                        <p className='card-text booking-days'>{formatDate(booking.startAt)} - {formatDate(booking.endAt)} | {booking.days} days</p>
                        <p className='card-text booking-price'><span>Payment: </span> <span className='booking-price-value'>$ {formatStripeAmount(payment.amount)}</span></p>
                        <p>Booking status: {booking.status}</p>
                        <p>Payment status: {payment.status}</p>
                        <Link className='btn btn-custom btn-block' to={`/rentals/${booking.rental._id}`}>Go to Rental</Link>
                        {payment.status === paymentStatus.PENDING && paymentButtons()}
                    </div>
                    <div className='card-footer text-muted'>
                        Created {formatDate(booking.createdAt)}
                    </div>
                </div>
            </div>
        )
    }
}