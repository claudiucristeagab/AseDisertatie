import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from 'helpers';
import { RentalManageModal } from './RentalManageModal';

export class RentalManageCard extends React.Component {
    constructor() {
        super();
        this.state = {
            wantDeletion: false
        }
        this.closeDeleteConfirm=this.closeDeleteConfirm.bind(this);
        this.showDeleteConfirm=this.showDeleteConfirm.bind(this);
    }

    showDeleteConfirm() {
        this.setState({
            wantDeletion: true
        })
    }

    closeDeleteConfirm() {
        this.setState({
            wantDeletion: false
        })
    }

    render() {
        const { rental, deleteRental } = this.props;
        const { wantDeletion } = this.state;
        return (
            <div className='col-md-4'>
                <div className='card text-center'>
                    <div className='card-block'>
                        <h4 className='card-title'>{rental.title} - {rental.city}, {rental.country}</h4>
                        <Link className='btn btn-custom btn-block' to={`/rentals/${rental._id}`}>Go to Rental</Link>
                        {rental.bookings.length > 0 && <RentalManageModal bookings={rental.bookings} />}
                        {wantDeletion &&
                            <div>
                                Are you sure you want to delete {rental.title}?
                                <button className='btn btn-custom btn-block' onClick={() => deleteRental(rental._id)}>Yes</button>
                                <button className='btn btn-custom btn-block' onClick={this.closeDeleteConfirm}>No</button>
                            </div>
                        }
                        {!wantDeletion &&
                            <button className='btn btn-custom btn-block' onClick={this.showDeleteConfirm}>Remove</button>

                        }
                    </div>
                    <div className='card-footer text-muted'>
                        Created at {formatDate(rental.createdAt)}
                    </div>
                </div>
            </div>
        )
    }
}