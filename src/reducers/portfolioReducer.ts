import * as types from '../actions/actionTypes';
import { reduceReducers } from './common';
import { Portfolio, PortfolioHistoryEntry, MpanSummary } from '../model/Models';

var initialState : PortfolioState = {    
    portfolios: null,
    portfolios_working: true,

    selected_portfolio: null,
    select_portfolio_working: true,

    portfolio_history: null,
    portfolio_history_working: true,

    portfolio_mpanSummary: null,
    portfolio_mpanSummary_working: true,
};

export interface PortfolioState {
    portfolios: Portfolio[];
    portfolios_working: boolean;

    selected_portfolio: Portfolio;
    select_portfolio_working: boolean;

    portfolio_history: PortfolioHistoryEntry[];
    portfolio_history_working: boolean;

    portfolio_mpanSummary: MpanSummary[];
    portfolio_mpanSummary_working: boolean;
}

const portfolioReducer = (state : PortfolioState, action: any) => {
    switch (action.type) {
        case types.FETCH_PORTFOLIOS_WORKING:
            return {
                portfolios: null,
                portfolios_working: true
            };
        case types.FETCH_PORTFOLIOS_SUCCESSFUL:
            return {
                portfolios: action.data,
                portfolios_working: false
            };

        case types.FETCH_SINGLE_PORTFOLIO_WORKING:
            return {
                selected_portfolio: null,
                select_portfolio_working: true
            };
        case types.FETCH_SINGLE_PORTFOLIO_SUCCESSFUL:
            return {
                selected_portfolio: action.data,
                select_portfolio_working: false
            };

        case types.FETCH_PORTFOLIO_HISTORY_WORKING:
            return {
                ...state,
                portfolio_history: action.data,
                portfolio_history_working: true
            };
        case types.FETCH_PORTFOLIO_HISTORY_SUCCESSFUL:
            return {
                ...state,
                portfolio_history: action.data,
                portfolio_history_working: false
            };

        case types.FETCH_PORTFOLIO_MPANSUMMARY_WORKING:
            return {
                ...state,
                portfolio_mpanSummary: action.data,
                portfolio_mpanSummary_working: true
            };
        case types.FETCH_PORTFOLIO_MPANSUMMARY_SUCCESSFUL:
            return {
                ...state,
                portfolio_mpanSummary: action.data,
                portfolio_mpanSummary_working: false
            };
        default:
            return state;
    }
}

export default reduceReducers((state = initialState) => state, portfolioReducer);