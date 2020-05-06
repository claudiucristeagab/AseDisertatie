import React from 'react';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import * as moment from 'moment';
import * as actions from 'actions';
import { ToastContainer, toast } from 'react-toastify';
import { getRangedDates } from 'helpers';
import {BookingModal} from './BookingModal';

export class Booking extends React.Component {

  constructor(){
    super();
    this.bookedOutDates = [];

    this.dateRef = React.createRef();

    this.state = {
      proposedBooking: {
        startAt: '',
        endAt: '',
        guests: 1,
        rental: {}
      },
      modal: {
        isOpen: false
      },
      errors: []
    }

    this.checkInvalidDates = this.checkInvalidDates.bind(this);
    this.handleDateRangeSelection = this.handleDateRangeSelection.bind(this);
    this.selectGuests = this.selectGuests.bind(this);
    this.cancelConfirmation = this.cancelConfirmation.bind(this);
    this.confirmBooking = this.confirmBooking.bind(this);
    this.reserveBooking = this.reserveBooking.bind(this);
  }

  componentWillMount() {
    this.getBookedOutDates();
  }

  getBookedOutDates() {
    const {bookings} = this.props.rental;
    if(bookings && bookings.length > 0){
      bookings.forEach(x => {
        const dateRange = getRangedDates(x.startAt, x.endAt, 'Y/MM/DD');
        this.bookedOutDates.push(...dateRange);
      });
    }
  }

  checkInvalidDates(date){
    return this.bookedOutDates.includes(date.format('Y/MM/DD'))
    || date.diff(moment(), 'days') < 0;
  }

  handleDateRangeSelection(event, picker){
    const startAt = picker.startDate.format('Y/MM/DD');
    const endAt = picker.endDate.format('Y/MM/DD');

    this.dateRef.current.value = startAt + ' - ' + endAt;

    this.setState({
      proposedBooking: {
        ...this.state.proposedBooking,
        startAt,
        endAt
      }
    })
  }

  selectGuests(event){
    this.setState({
      proposedBooking: {
        ...this.state.proposedBooking,
        guests: parseInt(event.target.value)
      }
    });
  }

  cancelConfirmation(){
    this.setState({
      modal: {
        isOpen: false
      }
    });
  }

  addNewBookedOutDays(booking){
    const dateRange = getRangedDates(booking.startAt, booking.endAt, 'Y/MM/DD');
    this.bookedOutDates.push(...dateRange);
  }

  resetForms(){
    this.dateRef.current.value = '';
    this.setState({
      proposedBooking: {
        guests: 1
      },
      errors: []
    })
  }

  confirmBooking(){
    const {startAt, endAt} = this.state.proposedBooking;
    const days = getRangedDates(startAt, endAt).length - 1;
    const { rental } = this.props;
    this.setState({
      proposedBooking: {
        ...this.state.proposedBooking,
        days,
        totalPrice: days * rental.dailyRate,
        rental
      },
      modal: {
        isOpen: true
      }
    });
  }

  reserveBooking(){
    actions.createBooking(this.state.proposedBooking).then(
      (booking) => {
        this.addNewBookedOutDays(booking);
        this.cancelConfirmation();
        this.resetForms();
        toast.success('Booking has been created.');
      },
      (errors) => {
        this.setState({errors})
      }
    )
  }

  render() {
    const {rental} = this.props;
    const {guests} = this.state.proposedBooking;
    return (
      <div className='booking'>
        <ToastContainer/>
        <h3 className='booking-price'>${rental.dailyRate} <span className='booking-per-night'>per night</span></h3>
        <hr></hr>
        <div className='form-group'>
        <label htmlFor='dates'>Dates</label>
          <DateRangePicker 
            onApply={this.handleDateRangeSelection}
            isInvalidDate={this.checkInvalidDates} 
            opens='left' 
            containerStyles={{display: 'block'}}
          >
            <input ref={this.dateRef} id='dates' type='text' className='form-control'></input>
          </DateRangePicker>
        </div>
        <div className='form-group'>
          <label htmlFor='guests'>Guests</label>
          <input 
            onChange={this.selectGuests}
            value={guests}
            min="1"
            max={rental.guests}
            type='number' 
            className='form-control' 
            id='guests' 
            aria-describedby='guests' 
            placeholder=''>
            </input>
        </div>
        <button onClick={this.confirmBooking} className='btn btn-bwm btn-confirm btn-block'>Book now</button>
        <hr></hr>
        <p className='booking-note-title'>People are interested into this house</p>
        <p className='booking-note-text'>
          More than 500 people checked this rental in last month.
        </p>
        <BookingModal isOpen={this.state.modal.isOpen}
          booking={this.state.proposedBooking}
          closeModal={this.cancelConfirmation}
          reserveBooking={this.reserveBooking}
          rental={this.props.rental}
          errors={this.state.errors}/>
      </div>
    )
  }
}
