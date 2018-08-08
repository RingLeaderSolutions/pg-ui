import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { RequestState, idleInitialRequestState } from '../RequestState';
import { Tender } from '../../model/Tender';

export interface TenderOffersState extends RequestState {
    value: Tender[];
}

const fetchTenderOffersReducer = requestResponseReducer(
    types.FETCH_TENDER_OFFERS_WORKING,
    types.FETCH_TENDER_OFFERS_SUCCESSFUL,
    types.FETCH_TENDER_OFFERS_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,  
            error: false,     
            value: action.data
        };
    }
);

export default reduceReducers((state = idleInitialRequestState) => state, fetchTenderOffersReducer);