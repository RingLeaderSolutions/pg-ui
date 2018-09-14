import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { RequestState, initialRequestState } from '../RequestState';
import { ContractRatesResponse } from '../../model/Tender';

export interface TendersState extends RequestState {
    value: ContractRatesResponse;
}

const quoteBackingSheetReducer = requestResponseReducer(
    types.FETCH_QUOTE_BACKINGSHEETS_WORKING,
    types.FETCH_QUOTE_BACKINGSHEETS_SUCCESSFUL,
    types.FETCH_QUOTE_BACKINGSHEETS_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,  
            error: false,          
            value: action.data
        };
    }
);

const contractBackingSheetReducer = requestResponseReducer(
    types.FETCH_CONTRACT_BACKINGSHEETS_WORKING,
    types.FETCH_CONTRACT_BACKINGSHEETS_SUCCESSFUL,
    types.FETCH_CONTRACT_BACKINGSHEETS_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,  
            error: false,          
            value: action.data
        };
    }
);

const accountContractRatesReducer = requestResponseReducer(
    types.FETCH_ACCOUNT_CONTRACT_BACKINGSHEETS_WORKING,
    types.FETCH_ACCOUNT_CONTRACT_BACKINGSHEETS_SUCCESSFUL,
    types.FETCH_ACCOUNT_CONTRACT_BACKINGSHEETS_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,  
            error: false,          
            value: action.data
        };
    }
);

export default reduceReducers((state = initialRequestState) => state, quoteBackingSheetReducer, contractBackingSheetReducer, accountContractRatesReducer);