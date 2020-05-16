import * as actionTypes from '../actions/types';

const INITIAL_STATE = {
    reviews: {
        data: [],
        errors: []
    }
};

export const reviewsReducer = (state = INITIAL_STATE.reviews, action) => {
    switch(action.type){
        case actionTypes.FETCH_RENTALS_INIT:
            return {...state, data: [], errors: []};
        case actionTypes.FETCH_REVIEWS_FOR_RENTAL_SUCCESS:
            return {...state, data: action.reviews }
        case actionTypes.FETCH_RENTALS_FAILURE:
            return {...state, data: [], errors: action.errors};
        default:
            return state;
    }
}