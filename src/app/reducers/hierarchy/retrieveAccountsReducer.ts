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
        let accounts = action.data as Account[];
        return {
            ...state,
            working: false,     
            error: false,       
            value: accounts.sort(
                (account1: Account, account2: Account) => {            
                    if (account1.companyName.toLowerCase() < account2.companyName.toLowerCase()) return -1;
                    if (account1.companyName.toLowerCase() > account2.companyName.toLowerCase()) return 1;
                    return 0;
                })
        };
    }
);

export default reduceReducers((state = initialRequestState) => state, retrieveAccountsReducer);