import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { DashboardPortfolioStatus } from '../../model/Models';
import { RequestState, initialRequestState } from '../RequestState';

export interface DashboardStatusState extends RequestState {
    value: DashboardPortfolioStatus;
}

const dashboardStatusReducer = requestResponseReducer(
    types.FETCH_DASHBOARD_STATUS_WORKING,
    types.FETCH_DASHBOARD_STATUS_SUCCESSFUL,
    types.FETCH_DASHBOARD_STATUS_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,     
            error: false,       
            value: action.data
        };
    }
);

export default reduceReducers((state = initialRequestState) => state, dashboardStatusReducer);