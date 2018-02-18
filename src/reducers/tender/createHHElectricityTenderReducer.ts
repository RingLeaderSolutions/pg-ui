import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { RequestState, idleInitialRequestState } from '../RequestState';

const createHHElectricityTenderReducer = requestResponseReducer(
    types.CREATE_HH_ELECTRICITY_TENDER_WORKING,
    types.CREATE_HH_ELECTRICITY_TENDER_SUCCESSFUL,
    types.CREATE_HH_ELECTRICITY_TENDER_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,  
            error: false
        };
    }
);

export default reduceReducers((state = idleInitialRequestState) => state, createHHElectricityTenderReducer);