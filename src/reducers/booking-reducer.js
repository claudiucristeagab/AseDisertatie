import * as actionTypes from '../actions/types';

const INITIAL_STATE = {
    data: [],
    errors: [],
    isLoading: false
};

export const userBookingsReducer = (state = INITIAL_STATE, action) => {
    switch(action.type){
        case actionTypes.FETCH_USER_BOOKINGS_INIT:
            return {...state, data: [], errors: [], isLoading: true };
        case actionTypes.FETCH_USER_BOOKINGS_SUCCESS:
            return {...state, data: action.userBookings, isLoading: false };
        case actionTypes.FETCH_USER_BOOKINGS_FAILURE:
            return {...state, data: [], errors: action.errors, isLoading: false};
        default:
            return state;
    }
}