import * as types from '../actions/actionTypes';
import { reduceReducers } from './common';
import { DashboardPortfolioSummary, DashboardPortfolioStatus, DashboardPortfolioTimeline } from '../model/Models';

var initialState : DashboardState = {  
    summary: null,
    summary_working: true,

    status: null,
    status_working: true,

    timeline: null,
    timeline_working: true
};

export interface DashboardState {
    summary: DashboardPortfolioSummary;
    summary_working: boolean;
    
    status: DashboardPortfolioStatus;
    status_working: boolean;

    timeline: DashboardPortfolioTimeline;
    timeline_working: boolean;
}

const dashboardReducer = (state : DashboardState, action: any) => {
    switch (action.type) {
        // Portfolio summary (stats)
        case types.FETCH_DASHBOARD_SUMMARY_WORKING:
            return {
                ...state,
                summary: null,
                summary_working: true
            };
        case types.FETCH_DASHBOARD_SUMMARY_SUCCESSFUL:        
            return {
                ...state,
                summary: action.data,
                summary_working: false
            };

        // Portfolio status (chart)
        case types.FETCH_DASHBOARD_STATUS_WORKING:
            return {
                ...state,
                status: null,
                status_working: true
            };
        case types.FETCH_DASHBOARD_STATUS_SUCCESSFUL:
            return {
                ...state,
                status: action.data,
                status_working: false
            };

        // Portfolio timeline (table)
        case types.FETCH_DASHBOARD_TIMELINE_WORKING:
            return {
                ...state,
                timeline: null,
                timeline_working: true
            };
        case types.FETCH_DASHBOARD_TIMELINE_SUCCESSFUL:        
            return {
                ...state,
                timeline: action.data,
                timeline_working: false
            };
        default:
            return state;
    }
}

export default reduceReducers((state = initialState) => state, dashboardReducer);