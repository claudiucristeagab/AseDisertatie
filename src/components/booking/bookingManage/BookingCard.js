import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from 'helpers';

export class BookingCard extends React.Component {
    render() {
        const {booking} = this.props;
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
                        <Link className='btn btn-custom btn-block' to={`/rentals/${booking.rental._id}`}>Go to Rental</Link>
                        <button type="button" className='btn btn-custom btn-block'>Cancel</button>
                    </div>
                    <div className='card-footer text-muted'>
                        Created {formatDate(booking.createdAt)}
                    </div>
                </div>
            </div>
        )
    }
}