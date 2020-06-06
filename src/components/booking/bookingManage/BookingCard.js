import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from 'helpers';
import { ReviewModal } from 'components/review/ReviewModal';

export class BookingCard extends React.Component {
    render() {
        const { booking, hasReview } = this.props;
        return (
            <div className='col-md-4'>
                <div className='card text-center'>
                    <div className='card-header'>
                        {booking.rental.category}
                    </div>
                    <div className='card-block'>
                        <h4 className='card-title'> {booking.rental.title} - {booking.rental.city}, {booking.rental.country}</h4>
                        <p className='card-text booking-desc'>{booking.rental.description}</p>
                        <p className='card-text booking-days'>{formatDate(booking.startAt)} - {formatDate(booking.endAt)} | {booking.days} days</p>
                        <p className='card-text booking-price'><span>Price: </span> <span className='booking-price-value'>$ {booking.totalPrice}</span></p>
                        <p>Status: {booking.status}</p>
                        <Link className='btn btn-custom btn-block' to={`/rentals/${booking.rental._id}`}>Go to Rental</Link>
                        {
                            !hasReview && (booking.status === 'active') &&
                            <ReviewModal bookingId={booking._id} />
                        }
                        {
                            (booking.status !== 'declined') &&
                            <button type="button" className='btn btn-custom btn-block'>Cancel</button>
                        }
                        
                    </div>
                    <div className='card-footer text-muted'>
                        Created {formatDate(booking.createdAt)}
                    </div>
                </div>
            </div>
        )
    }
}