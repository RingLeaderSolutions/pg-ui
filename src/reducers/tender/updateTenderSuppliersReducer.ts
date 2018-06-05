import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { idleInitialRequestState } from '../RequestState';

const updateTenderSuppliersReducer = requestResponseReducer(
    types.UPDATE_TENDER_SUPPLIERS_WORKING,
    types.UPDATE_TENDER_SUPPLIERS_SUCCESSFUL,
    types.UPDATE_TENDER_SUPPLIERS_FAILED,
    (state) => {
        return {
            ...state,
            working: false,  
            error: false
        };
    }
);

export default reduceReducers((state = idleInitialRequestState) => state, updateTenderSuppliersReducer);