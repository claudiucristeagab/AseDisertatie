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
import * as actionTypes from './types';
import authService from 'services/authService';
import axiosService from 'services/axiosService';

const rentalsPath = process.env.REACT_APP_API_URI + 'rentals';
const usersPath = process.env.REACT_APP_API_URI + 'users';
const bookingsPath = process.env.REACT_APP_API_URI + 'bookings';
const reviewsPath = process.env.REACT_APP_API_URI + 'reviews';
const imagesPath = process.env.REACT_APP_API_URI + 'images';
const paymentsPath = process.env.REACT_APP_API_URI + 'payments';

const axiosInstance = axiosService.getInstance();

//#region Rentals
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

export const fetchRentals = (searchQuery, page) => {
  return (dispatch) => {
    dispatch(fetchRentalsInit());
    axiosInstance.get(rentalsPath,
      {
        params: {
          search: searchQuery,
          // user: userId,
          page: page
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

const fetchRentalsInit = () => {
  return {
    type: FETCH_RENTALS_INIT
  }
}

export const fetchUserRentals = () => {
  return axiosInstance.get(rentalsPath + '/manage', {})
    .then(
      res => res.data,
      err => Promise.reject(err.response.data.errors)
    );
}

export const createRental = (rental) => {
  return axiosInstance.post(rentalsPath, rental)
    .then(res => res.data, err => Promise.reject(err.response.data.errors));
}

export const updateRental = (id, rental) => {
  return axiosInstance.put(`${rentalsPath}/${id}`, rental)
    .then(res => res.data, err => Promise.reject(err.response.data.errors));
}

export const deleteRental = (id) => {
  return axiosInstance.delete(`${rentalsPath}/${id}`, id)
    .then(res => res.data, err => Promise.reject(err.response.data.errors));
}

//#endregion

//#region User
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
  const username = authService.getUsername();
  return {
    type: LOGIN_SUCCESS,
    username
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

//#endregion

//#region Bookings

export const createBooking = (booking) => {
  return axiosInstance.post(bookingsPath, booking)
    .then(res => res.data)
    .catch((err) => Promise.reject(err.response.data.errors))
}

export const fetchUserBookings = () => {
  return (dispatch) => {
    dispatch(fetchUserBookingsInit());
    axiosInstance.get(bookingsPath + '/manage')
      .then(res => res.data)
      .then((userBookings) => {
        dispatch(fetchUserBookingsSuccess(userBookings))
      })
      .catch(({ response }) => dispatch(fetchUserBookingsFailure(response.data.errors)));
  }
}

export const fetchUserBookingsInit = () => {
  return {
    type: actionTypes.FETCH_USER_BOOKINGS_INIT
  };
}

export const fetchUserBookingsSuccess = (userBookings) => {
  return {
    type: actionTypes.FETCH_USER_BOOKINGS_SUCCESS,
    userBookings
  };
}

export const fetchUserBookingsFailure = (errors) => {
  return {
    type: actionTypes.FETCH_USER_BOOKINGS_FAILURE,
    errors
  };
}

//#endregion

//#region Reviews

export const getReviewsForRental = (id) => {
  return dispatch => {
    dispatch(fetchReviewsInit());
    axiosInstance.get(reviewsPath, {
      params: {
        rentalId: id
      }
    }).then(res => res.data)
      .then((reviews) => dispatch(fetchReviewsSuccess(reviews)))
      .catch(({ response }) => dispatch(fetchReviewsFailure(response.data.errors)));
  }
}

const fetchReviewsInit = (reviews) => {
  return {
    type: actionTypes.FETCH_REVIEWS_FOR_RENTAL_INIT,
    reviews
  }
}

const fetchReviewsSuccess = (reviews) => {
  return {
    type: actionTypes.FETCH_REVIEWS_FOR_RENTAL_SUCCESS,
    reviews
  }
}

const fetchReviewsFailure = (errors) => {
  return {
    type: actionTypes.FETCH_REVIEWS_FOR_RENTAL_FAILURE,
    errors
  }
}

export const getScoreForRental = (rentalId) => {
  return axiosInstance.get(`${reviewsPath}/${rentalId}/rating`)
    .then(
      res => res.data,
      (err) => Promise.reject(err.response.data.errors)
    )
}

export const createReview = (review, bookingId) => {

  return axiosInstance.post(reviewsPath, review,
    {
      params: {
        bookingId: bookingId
      }
    })
    .then(res => res.data)
    .catch(({ response }) => Promise.reject(response.data.errors))
}

//#endregion

//#region Payments

export const getPendingPayments = () => {
  return dispatch => {
    dispatch(fetchPendingPaymentsInit());
    axiosInstance.get(paymentsPath)
      .then(res => res.data)
      .then(payments => dispatch(fetchPendingPaymentsSuccess(payments)))
      .catch(({ response }) => dispatch(fetchPendingPaymentsFailure(response.data.errors)))
  }
}

const fetchPendingPaymentsInit = (payments) => {
  return {
    type: actionTypes.FETCH_PENDING_PAYMENTS_INIT,
    payments
  }
}

const fetchPendingPaymentsSuccess = (payments) => {
  return {
    type: actionTypes.FETCH_PENDING_PAYMENTS_SUCCESS,
    payments
  }
}

const fetchPendingPaymentsFailure = (payments) => {
  return {
    type: actionTypes.FETCH_PENDING_PAYMENTS_FAILURE,
    payments
  }
}

export const acceptPayment = (paymentId) => {
  return axiosInstance
    .post(paymentsPath + '/accept', paymentId)
    .then(res => res.data)
    .catch(({ response }) => response.data.errors)
}

export const declinePayment = (paymentId) => {
  return axiosInstance
    .post(paymentsPath + '/decline', paymentId)
    .then(res => res.data)
    .catch(({ response }) => response.data.errors)

}
//#endregion

//#region Images

export const uploadImage = image => {
  const formData = new FormData();
  formData.append('image', image)
  return axiosInstance.post(imagesPath, formData)
    .then(json => {
      return json.data.imageUrl
    })
    .catch(({ response }) => Promise.reject(response.data.errors))

  //#endregion
}