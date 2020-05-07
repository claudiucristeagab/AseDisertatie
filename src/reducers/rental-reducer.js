import * as actionTypes from '../actions/types';

const INITIAL_STATE = {
    rentals: {
        data: [],
        errors: []
    },
    rental: {
        data: []
    }
};

export const rentalReducer = (state = INITIAL_STATE.rentals, action) => {
    switch(action.type){
        case actionTypes.FETCH_RENTALS_INIT:
            return {...state, data: [], errors: []};
        case actionTypes.FETCH_RENTALS_SUCCESS:
            return {...state, data: action.rentals }
        case actionTypes.FETCH_RENTALS_FAILURE:
            return {...state, data: [], errors: action.errors};
        default:
            return state;
    }
}

export const selectedRentalReducer = (state = INITIAL_STATE.rental, action) => {
    switch(action.type) {
        case actionTypes.FETCH_RENTAL_BY_ID_INIT:
            return {...state, data: {}}
        case actionTypes.FETCH_RENTAL_BY_ID_SUCCESS:
            return {...state, data: action.rental }
        default:
            return state;
    }
}