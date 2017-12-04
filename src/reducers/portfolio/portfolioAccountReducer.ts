import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { Account } from '../../model/Models';
import { RequestState, initialRequestState } from '../RequestState';

export interface PortfolioAccountState extends RequestState {
    value: Account;
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

const updateAccountReducer = requestResponseReducer(
    types.UPDATE_COMPANY_STATUS_WORKING,
    types.UPDATE_COMPANY_STATUS_SUCCESSFUL,
    types.UPDATE_COMPANY_STATUS_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,
            error: false,
            value: action.data
        };
    }
);

export default reduceReducers((state = initialRequestState) => state, portfolioAccountReducer, updateAccountReducer);