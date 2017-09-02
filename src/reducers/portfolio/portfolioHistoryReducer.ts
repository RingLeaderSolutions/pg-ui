import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { PortfolioHistoryEntry } from '../../model/Models';
import { RequestState, initialRequestState } from '../RequestState';

export interface PortfolioHistoryState extends RequestState {
    value: PortfolioHistoryEntry[];
}

const portfolioHistoryReducer = requestResponseReducer(
    types.FETCH_PORTFOLIO_HISTORY_WORKING,
    types.FETCH_PORTFOLIO_HISTORY_SUCCESSFUL,
    types.FETCH_PORTFOLIO_HISTORY_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,            
            value: action.data
        };
    }
);

export default reduceReducers((state = initialRequestState) => state, portfolioHistoryReducer);