import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { Account, AccountContact } from '../../model/Models';
import { RequestState, initialRequestState } from '../RequestState';

export interface PortfolioAccountState {
    account: AccountState;
    contacts: AccountContactsState;
}

export interface AccountContactsState extends RequestState {
    value: AccountContact[];
}

export interface AccountState extends RequestState {
    value: Account;
}

const accountContactReducer = requestResponseReducer(
    types.RETRIEVE_ACCOUNT_CONTACTS_WORKING,
    types.RETRIEVE_ACCOUNT_CONTACTS_SUCCESSFUL,
    types.RETRIEVE_ACCOUNT_CONTACTS_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,         
            error: false,   
            value: action.data
        };
    }
);

export const retrieveContactsReducer = reduceReducers((state = initialRequestState) => state, accountContactReducer);

const accountReducer = requestResponseReducer(
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

export const retrieveAccountReducer = reduceReducers((state = initialRequestState) => state, accountReducer);