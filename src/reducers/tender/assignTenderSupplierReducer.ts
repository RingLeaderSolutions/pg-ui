import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { RequestState, idleInitialRequestState } from '../RequestState';

const assignTenderSupplierReducer = requestResponseReducer(
    types.ASSIGN_TENDER_SUPPLIER_WORKING,
    types.ASSIGN_TENDER_SUPPLIER_SUCCESSFUL,
    types.ASSIGN_TENDER_SUPPLIER_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,  
            error: false
        };
    }
);

export default reduceReducers((state = idleInitialRequestState) => state, assignTenderSupplierReducer);