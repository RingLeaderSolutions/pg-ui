import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { Account } from '../../model/Models';
import { RequestState, initialRequestState } from '../RequestState';

export interface AccountsState extends RequestState {
    value: Account[];
}

const retrieveAccountsReducer = requestResponseReducer(
    types.RETRIEVE_ACCOUNTS_WORKING,
    types.RETRIEVE_ACCOUNTS_SUCCESSFUL,
    types.RETRIEVE_ACCOUNTS_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,     
            error: false,       
            value: action.data
        };
    }
);

export default reduceReducers((state = initialRequestState) => state, retrieveAccountsReducer);