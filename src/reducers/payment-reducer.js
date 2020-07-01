import * as actionTypes from '../actions/types';

const INITIAL_STATE = {
    payments: {
        data: [],
        errors: [],
        isLoading: false
    }
};

export const paymentsReducer = (state = INITIAL_STATE.payments, action) => {
    switch(action.type){
        case actionTypes.FETCH_PENDING_PAYMENTS_INIT:
            return {...state, data: [], errors: [], isLoading: true };
        case actionTypes.FETCH_PENDING_PAYMENTS_SUCCESS:
            return {...state, data: action.payments, isLoading: false };
        case actionTypes.FETCH_PENDING_PAYMENTS_FAILURE:
            return {...state, data: [], errors: action.errors, isLoading: false};
        default:
            return state;
    }
}