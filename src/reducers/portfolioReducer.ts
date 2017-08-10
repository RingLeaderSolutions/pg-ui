import * as types from '../actions/actionTypes';
import { reduceReducers } from './common';
import { Portfolio } from '../model/Models';

var initialState : PortfolioState = {    
    portfolios: null
};

export interface PortfolioState {
    portfolios: Portfolio[];
}

const portfolioReducer = (state : PortfolioState, action: any) => {
    switch (action.type) {
        case types.FETCH_PORTFOLIO_SUCCESSFUL:
            return {
                portfolios: action.portfolios
            };
        default:
            return state;
    }
}

export default reduceReducers((state = initialState) => state, portfolioReducer);