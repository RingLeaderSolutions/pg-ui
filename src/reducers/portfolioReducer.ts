import * as types from '../actions/actionTypes';
import { reduceReducers } from './common';
import { Portfolio } from '../model/Models';

var initialState : PortfolioState = {    
    portfolios: null,
    portfolios_working: true
};

export interface PortfolioState {
    portfolios: Portfolio[];
    portfolios_working: boolean;
}

const portfolioReducer = (state : PortfolioState, action: any) => {
    switch (action.type) {
        case types.FETCH_PORTFOLIOS_WORKING:
            return {
                ...state,
                portfolios: null,
                portfolios_working: true
            };
        case types.FETCH_PORTFOLIOS_SUCCESSFUL:
            return {
                ...state,
                portfolios: action.data,
                portfolios_working: false
            };
        default:
            return state;
    }
}

export default reduceReducers((state = initialState) => state, portfolioReducer);