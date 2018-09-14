import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { idleInitialRequestState } from '../RequestState';

const deleteTenderReducer = requestResponseReducer(
    types.DELETE_TENDER_WORKING,
    types.DELETE_TENDER_SUCCESSFUL,
    types.DELETE_TENDER_FAILED,
    (state) => {
        return {
            ...state,
            working: false,  
            error: false
        };
    }
);

export default reduceReducers((state = idleInitialRequestState) => state, deleteTenderReducer);