import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { DashboardPortfolioTimeline } from '../../model/Models';
import { RequestState, initialRequestState } from '../RequestState';

export interface DashboardTimelineState extends RequestState {
    value: DashboardPortfolioTimeline;
}

const dashboardTimelineReducer = requestResponseReducer(
    types.FETCH_DASHBOARD_TIMELINE_WORKING,
    types.FETCH_DASHBOARD_TIMELINE_SUCCESSFUL,
    types.FETCH_DASHBOARD_TIMELINE_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,            
            error: false,
            value: action.data
        };
    }
);

export default reduceReducers((state = initialRequestState) => state, dashboardTimelineReducer);