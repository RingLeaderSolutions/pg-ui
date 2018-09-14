import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { idleInitialRequestState } from '../RequestState';

const createTenderReducer = requestResponseReducer(
    types.CREATE_TENDER_WORKING,
    types.CREATE_TENDER_SUCCESSFUL,
    types.CREATE_TENDER_FAILED,
    (state) => {
        return {
            ...state,
            working: false,  
            error: false
        };
    }
);

export default reduceReducers((state = idleInitialRequestState) => state, createTenderReducer);