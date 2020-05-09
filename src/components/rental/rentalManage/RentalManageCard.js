import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from 'helpers';

export class RentalManageCard extends React.Component {
    render() {
        const { rental } = this.props;
        return (
            <div className='col-md-4'>
                <div className='card text-center'>
                    <div className='card-block'>
                        <h4 className='card-title'>{rental.title} - {rental.city}, {rental.country}</h4>
                        <Link className='btn btn-custom' to={`/rentals/${rental._id}`}>Go to Rental</Link>
                        <button className='btn btn-custom'>Bookings</button>
                    </div>
                    <div className='card-footer text-muted'>
                        Created at {formatDate(rental.createdAt)}
                    </div>
                </div>
            </div>
        )
    }
}