import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { RequestState, idleInitialRequestState } from '../RequestState';

const unassignTenderSupplierReducer = requestResponseReducer(
    types.UNASSIGN_TENDER_SUPPLIER_WORKING,
    types.UNASSIGN_TENDER_SUPPLIER_SUCCESSFUL,
    types.UNASSIGN_TENDER_SUPPLIER_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,  
            error: false
        };
    }
);

export default reduceReducers((state = idleInitialRequestState) => state, unassignTenderSupplierReducer);