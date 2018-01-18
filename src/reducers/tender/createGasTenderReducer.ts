import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { RequestState, idleInitialRequestState } from '../RequestState';

const createGasTenderReducer = requestResponseReducer(
    types.CREATE_GAS_TENDER_WORKING,
    types.CREATE_GAS_TENDER_SUCCESSFUL,
    types.CREATE_GAS_TENDER_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,  
            error: false
        };
    }
);

export default reduceReducers((state = idleInitialRequestState) => state, createGasTenderReducer);