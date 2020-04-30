import axios from 'axios';
import {
  FETCH_RENTALS_INIT, 
  FETCH_RENTALS_SUCCESS, 
  FETCH_RENTAL_BY_ID_SUCCESS, 
  FETCH_RENTAL_BY_ID_INIT,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT
} from './types';
import authService from 'services/authService';

const rentalsPath = process.env.REACT_APP_API_URI + 'rentals';
const usersPath = process.env.REACT_APP_API_URI + 'users';

// Rentals

export const fetchRentalById = (rentalId) => {
  return (dispatch) => {
    dispatch(fetchRentalByIdInit());
    axios.get(`${rentalsPath}/${rentalId}`)
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
    axios.get(rentalsPath)
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

// User
export const register = (userData) => {
  return axios.post(`${usersPath}/register`, {...userData})
    .then(
      (res) => {
        return res.data;
      },
      (err) => {
        return Promise.reject(err.response.data.errors);
      }
    )
}

export const loginSuccess = () => {
  return {
    type: LOGIN_SUCCESS
  }
}

export const loginFailure = (errors) => {
  return {
    type: LOGIN_FAILURE,
    errors
  }
}

export const checkAuthState = () => {
  return dispatch => {
    if (authService.isAuthenticated()){
      dispatch(loginSuccess());
    }
  }
}

export const login = (userData) => {
  return dispatch => {
    axios.post(`${usersPath}/auth`, {...userData})
    .then(res => res.data)
    .then(token => {
      authService.saveToken(token);
      dispatch(loginSuccess());
    })
    .catch((error)=>{
      dispatch(loginFailure(error.response.data.errors))
    })
  }
}

export const logout = () => {
  authService.invalidateUser();
  return {
    type: LOGOUT
  };
}