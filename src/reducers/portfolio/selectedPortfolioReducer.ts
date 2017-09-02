import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { Portfolio } from '../../model/Models';
import { RequestState, initialRequestState } from '../RequestState';

export interface SelectedPortfolioState extends RequestState {
    value: Portfolio;
}

const selectedPortfolioReducer = requestResponseReducer(
    types.FETCH_SINGLE_PORTFOLIO_WORKING,
    types.FETCH_SINGLE_PORTFOLIO_SUCCESSFUL,
    types.FETCH_SINGLE_PORTFOLIO_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,            
            value: action.data
        };
    }
);

export default reduceReducers((state = initialRequestState) => state, selectedPortfolioReducer);