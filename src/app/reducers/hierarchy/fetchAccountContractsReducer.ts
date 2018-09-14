import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { RequestState, initialRequestState } from '../RequestState';
import { TenderContract } from '../../model/Tender';

export interface AccountContractsState extends RequestState {
    value: TenderContract[];
}

const fetchAccountContractsReducer = requestResponseReducer(
    types.FETCH_ACCOUNT_CONTRACTS_WORKING,
    types.FETCH_ACCOUNT_CONTRACTS_SUCCESSFUL,
    types.FETCH_ACCOUNT_CONTRACTS_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,     
            error: false,       
            value: action.data
        };
    }
);

export default reduceReducers((state = initialRequestState) => state, fetchAccountContractsReducer);