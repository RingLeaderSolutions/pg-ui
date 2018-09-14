import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { AccountDetail } from '../../model/Models';
import { RequestState, initialRequestState } from '../RequestState';

export interface PortfolioAccountState extends RequestState {
    value: AccountDetail;
}

const portfolioAccountReducer = requestResponseReducer(
    types.RETRIEVE_ACCOUNT_WORKING,
    types.RETRIEVE_ACCOUNT_SUCCESSFUL,
    types.RETRIEVE_ACCOUNT_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,         
            error: false,   
            value: action.data
        };
    }
);

export default reduceReducers((state = initialRequestState) => state, portfolioAccountReducer);