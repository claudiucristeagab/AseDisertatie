import React from 'react';
import Modal from 'react-responsive-modal';
import { formatDate } from 'helpers';

export class RentalManageModal extends React.Component {
    constructor() {
        super();
        this.state = {
            isOpen: false
        }
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    openModal() {
        this.setState({
            isOpen: true
        })
    }

    closeModal() {
        this.setState({
            isOpen: false
        })
    }

    renderBookings(bookings) {
        console.log(bookings);
        return bookings.map((booking, index) =>
            <React.Fragment key={index}>
                <p><span>Dates: </span>{formatDate(booking.startAt)} - {formatDate(booking.endAt)}</p>
                <p><span>Guests: </span>{booking.guests}</p>
                <p><span>Total Price: </span>${booking.totalPrice}</p>
                <p><span>Status: </span>{booking.status}</p>
                <hr></hr>
            </React.Fragment>
        )
    }

    render() {
        const { bookings } = this.props;
        const { isOpen } = this.state;
        return (
            <React.Fragment>
                <button type='button' onClick={this.openModal} className='btn btn-custom btn-block'>Bookings</button>
                <Modal open={isOpen} onClose={this.closeModal} little classNames={{ modal: 'rental-booking-modal' }}>
                    <h4 className='modal-title title'>Made Bookings</h4>
                    <div className='modal-body bookings-inner-container'>
                        {this.renderBookings(bookings)}
                    </div>
                    <div className='modal-footer'>
                        <button type='button' onClick={this.closeModal} className='btn btn-custom'>Cancel</button>
                    </div>
                </Modal>
            </React.Fragment>
        )
    }
}