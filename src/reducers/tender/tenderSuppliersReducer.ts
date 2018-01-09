import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { RequestState, initialRequestState } from '../RequestState';
import { TenderSupplier } from '../../model/Tender';

export interface TenderSuppliersState extends RequestState {
    value: TenderSupplier[];
}

const tenderSuppliersReducer = requestResponseReducer(
    types.FETCH_TENDER_SUPPLIERS_WORKING,
    types.FETCH_TENDER_SUPPLIERS_SUCCESSFUL,
    types.FETCH_TENDER_SUPPLIERS_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,  
            error: false,          
            value: action.data
        };
    }
);

export default reduceReducers((state = initialRequestState) => state, tenderSuppliersReducer);