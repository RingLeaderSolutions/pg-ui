import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { MpanSummary } from '../../model/Models';
import { RequestState, initialRequestState } from '../RequestState';

export interface PortfolioMpanSummaryState extends RequestState {
    value: MpanSummary[];
}

const portfolioMpanSummaryReducer = requestResponseReducer(
    types.FETCH_PORTFOLIO_MPANSUMMARY_WORKING,
    types.FETCH_PORTFOLIO_MPANSUMMARY_SUCCESSFUL,
    types.FETCH_PORTFOLIO_MPANSUMMARY_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,            
            value: action.data
        };
    }
);

export default reduceReducers((state = initialRequestState) => state, portfolioMpanSummaryReducer);