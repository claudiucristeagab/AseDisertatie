import React from 'react';
import Modal from 'react-responsive-modal';
import {ResultError} from 'components/shared/form/ResultError'

export const BookingModal = (props) => {
    const { isOpen, closeModal, reserveBooking, booking, rental, errors, acceptPayment, disabled } = props;
    return (
        <Modal open={isOpen} onClose={closeModal} little classNames={{ modal: 'booking-modal' }}>
        <h4 className='modal-title title'>Confirm Booking </h4>
        <p className='dates'>{booking.startAt} - {booking.endAt}</p>
        <div className='modal-body'>
            <em>{booking.days}</em> nights / <em>${rental.dailyRate}</em> per Night
            <p>Guests: <em>{booking.guests}</em></p>
            <p>Price: <em>${booking.totalPrice}</em></p>
            {acceptPayment && acceptPayment()}
            <p>Do you confirm your booking for selected days?</p>
        </div>
        <ResultError errors={errors}/>
        <div className='modal-footer'>
            <button type='button' onClick={reserveBooking} className='btn btn-custom' disabled={disabled}>Confirm</button>
            <button type='button' onClick={closeModal} className='btn btn-custom'>Cancel</button>
        </div>
        </Modal>

    );
}