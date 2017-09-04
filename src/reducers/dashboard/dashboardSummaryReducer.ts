import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { DashboardPortfolioSummary } from '../../model/Models';
import { RequestState, initialRequestState } from '../RequestState';

export interface DashboardSummaryState extends RequestState {
    value: DashboardPortfolioSummary;
}

const dashboardSummaryReducer = requestResponseReducer(
    types.FETCH_DASHBOARD_SUMMARY_WORKING,
    types.FETCH_DASHBOARD_SUMMARY_SUCCESSFUL,
    types.FETCH_DASHBOARD_SUMMARY_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,
            error: false,
            value: action.data
        };
    }
);

export default reduceReducers((state = initialRequestState) => state, dashboardSummaryReducer);