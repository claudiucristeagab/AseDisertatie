import {
  FETCH_RENTALS_INIT,
  FETCH_RENTALS_SUCCESS,
  FETCH_RENTALS_FAILURE,
  FETCH_RENTAL_BY_ID_SUCCESS,
  FETCH_RENTAL_BY_ID_INIT,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT
} from './types';
import authService from 'services/authService';
import axiosService from 'services/axiosService';

const rentalsPath = process.env.REACT_APP_API_URI + 'rentals';
const usersPath = process.env.REACT_APP_API_URI + 'users';
const bookingsPath = process.env.REACT_APP_API_URI + 'bookings';

const axiosInstance = axiosService.getInstance();

// Rentals
export const fetchRentalById = (rentalId) => {
  return (dispatch) => {
    dispatch(fetchRentalByIdInit());
    axiosInstance.get(`${rentalsPath}/${rentalId}`)
      .then(res => res.data)
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

export const fetchRentals = (searchQuery) => {
  return (dispatch) => {
    dispatch(fetchRentalsInit());
    axiosInstance.get(rentalsPath,
      {
        params: {
          search: searchQuery
        }
      })
      .then(res => res.data)
      .then((rentals) => {
        dispatch(fetchRentalsSuccess(rentals))
      })
      .catch(({ response }) => dispatch(fetchRentalsFailure(response.data.errors)));
  }
}

const fetchRentalsSuccess = (rentals) => {
  return {
    type: FETCH_RENTALS_SUCCESS,
    rentals
  }
}

const fetchRentalsFailure = (errors) => {
  return {
    type: FETCH_RENTALS_FAILURE,
    errors
  }
}

const fetchRentalsInit = (rentals) => {
  return {
    type: FETCH_RENTALS_INIT
  }
}

export const createRental = (rental) => {
  return axiosInstance.post(rentalsPath, rental)
    .then(res => res.data, err => Promise.reject(err.response.data.errors));
}

// User
export const register = (userData) => {
  return axiosInstance.post(`${usersPath}/register`, { ...userData })
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
    if (authService.isAuthenticated()) {
      dispatch(loginSuccess());
    }
  }
}

export const login = (userData) => {
  return dispatch => {
    axiosInstance.post(`${usersPath}/auth`, { ...userData })
      .then(res => res.data)
      .then(token => {
        authService.saveToken(token);
        dispatch(loginSuccess());
      })
      .catch((error) => {
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

// Bookings

export const createBooking = (booking) => {
  return axiosInstance.post(bookingsPath, booking)
    .then(res => res.data)
    .catch(({ response }) => Promise.reject(response.data.errors))
}