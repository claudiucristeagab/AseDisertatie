import React from 'react';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import { getRangedDates } from 'helpers';
import * as moment from 'moment';
import * as actions from 'actions';
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
        guests: 0
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
        startAt,
        endAt
      }
    })
  }

  selectGuests(event){
    this.setState({
      proposedBooking: {
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

  confirmBooking(){
    this.setState({
      modal: {
        isOpen: true
      }
    });
  }

  reserverBooking(){
    actions.createBooking(this.state.proposedBooking).then(
      (booking) => {
        
      },
      (errors) => {
        this.setState({errors})
      }
    )
  }

  render() {
    const {rental} = this.props;
    return (
      <div className='booking'>
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
        <BookingModal isOpen={this.state.modal.isOpen} closeModal={this.cancelConfirmation}/>
      </div>
    )
  }
}
