import axios from 'axios';
import {FETCH_RENTALS_INIT, FETCH_RENTALS_SUCCESS, FETCH_RENTAL_BY_ID_SUCCESS, FETCH_RENTAL_BY_ID_INIT} from './types';

const path = process.env.REACT_APP_API_URI + 'rentals/';

export const fetchRentalById = (rentalId) => {
  return (dispatch) => {
    dispatch(fetchRentalByIdInit());
    axios.get(`${path}${rentalId}`)
    .then(res => res.data )
    .then((rental) => {
      dispatch(fetchRentalByIdSuccess(rental));
    });
  }
}

const fetchRentalByIdInit = () => {
  return {
    type: FETCH_RENTAL_BY_ID_INIT
  }
}

const fetchRentalByIdSuccess = (rental) => {
  return {
    type: FETCH_RENTAL_BY_ID_SUCCESS,
    rental
  }
}

export const fetchRentals = () => {
  return (dispatch) => {
    dispatch(fetchRentalsInit());
    axios.get(path)
    .then(res => res.data )
    .then((rentals) => {
      dispatch(fetchRentalsSuccess(rentals))
    });
  }
}

const fetchRentalsSuccess = (rentals) => {
  return {
    type: FETCH_RENTALS_SUCCESS,
    rentals
  }
}

const fetchRentalsInit = (rentals) => {
  return {
    type: FETCH_RENTALS_INIT
  }
}

