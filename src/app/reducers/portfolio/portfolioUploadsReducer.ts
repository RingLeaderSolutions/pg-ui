import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { UploadReportsResponse } from '../../model/Models';
import { RequestState, idleInitialRequestState } from '../RequestState';

export interface PortfolioUploadsState extends RequestState {
    value: UploadReportsResponse;
}

const portfolioUploadsReducer = requestResponseReducer(
    types.FETCH_PORTFOLIO_UPLOADS_WORKING,
    types.FETCH_PORTFOLIO_UPLOADS_SUCCESSFUL,
    types.FETCH_PORTFOLIO_UPLOADS_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,         
            error: false,   
            value: action.data
        };
    }
);

export default reduceReducers((state = idleInitialRequestState) => state, portfolioUploadsReducer);