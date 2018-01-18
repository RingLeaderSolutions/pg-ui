import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { RequestState, idleInitialRequestState } from '../RequestState';

const createElectricityTenderReducer = requestResponseReducer(
    types.CREATE_ELECTRICITY_TENDER_WORKING,
    types.CREATE_ELECTRICITY_TENDER_SUCCESSFUL,
    types.CREATE_ELECTRICITY_TENDER_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,  
            error: false
        };
    }
);

export default reduceReducers((state = idleInitialRequestState) => state, createElectricityTenderReducer);