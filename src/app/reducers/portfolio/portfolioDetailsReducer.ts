import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { PortfolioDetails } from '../../model/Models';
import { RequestState, initialRequestState } from '../RequestState';

export interface PortfolioDetailsState extends RequestState {
    value: PortfolioDetails;
}

const portfolioDetailsReducer = requestResponseReducer(
    types.FETCH_PORTFOLIO_DETAILS_WORKING,
    types.FETCH_PORTFOLIO_DETAILS_SUCCESSFUL,
    types.FETCH_PORTFOLIO_DETAILS_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,         
            error: false,   
            value: action.data
        };
    }
);

export default reduceReducers((state = initialRequestState) => state, portfolioDetailsReducer);