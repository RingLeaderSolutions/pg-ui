import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { idleInitialRequestState } from '../RequestState';

const updateTenderReducer = requestResponseReducer(
    types.UPDATE_TENDER_WORKING,
    types.UPDATE_TENDER_SUCCESSFUL,
    types.UPDATE_TENDER_FAILED,
    (state) => {
        return {
            ...state,
            working: false,  
            error: false
        };
    }
);

export default reduceReducers((state = idleInitialRequestState) => state, updateTenderReducer);