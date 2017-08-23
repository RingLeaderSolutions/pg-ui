import * as types from '../actions/actionTypes';
import { reduceReducers } from './common';
import { Portfolio, PortfoliosSummary, PortfoliosStatus, PortfoliosTimeline } from '../model/Models';

var initialState : PortfolioState = {    
    portfolios: null,
    
    summary: null,
    summary_working: true,

    status: null,
    status_working: true,

    timeline: null,
    timeline_working: true
};

export interface PortfolioState {
    portfolios: Portfolio[];

    summary: PortfoliosSummary;
    summary_working: boolean;
    
    status: PortfoliosStatus;
    status_working: boolean;

    timeline: PortfoliosTimeline;
    timeline_working: boolean;
}

const portfolioReducer = (state : PortfolioState, action: any) => {
    switch (action.type) {
        // Portfolio summary (stats)
        case types.FETCH_PORTFOLIOS_SUMMARY_WORKING:
            return {
                ...state,
                summary: null,
                summary_working: true
            };
        case types.FETCH_PORTFOLIOS_SUMMARY_SUCCESSFUL:        
            return {
                ...state,
                summary: action.data,
                summary_working: false
            };

        // Portfolio status (chart)
        case types.FETCH_PORTFOLIOS_STATUS_WORKING:
            return {
                ...state,
                status: null,
                status_working: true
            };
        case types.FETCH_PORTFOLIOS_STATUS_SUCCESSFUL:
            return {
                ...state,
                status: action.data,
                status_working: false
            };

        // Portfolio timeline (table)
        case types.FETCH_PORTFOLIOS_TIMELINE_WORKING:
            return {
                ...state,
                timeline: null,
                timeline_working: true
            };
        case types.FETCH_PORTFOLIOS_TIMELINE_SUCCESSFUL:        
            return {
                ...state,
                timeline: action.data,
                timeline_working: false
            };

            
        case types.FETCH_PORTFOLIOS_SUCCESSFUL:
            return {
                ...state,
                portfolios: action.data
            };
        default:
            return state;
    }
}

export default reduceReducers((state = initialState) => state, portfolioReducer);