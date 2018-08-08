import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { RequestState, idleInitialRequestState } from '../RequestState';
import { Tender } from '../../model/Tender';

export interface TenderRecommendationsState extends RequestState {
    value: Tender[];
}

const fetchTenderRecommendationsReducer = requestResponseReducer(
    types.FETCH_TENDER_RECOMMENDATIONS_WORKING,
    types.FETCH_TENDER_RECOMMENDATIONS_SUCCESSFUL,
    types.FETCH_TENDER_RECOMMENDATIONS_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,  
            error: false,     
            value: action.data
        };
    }
);

export default reduceReducers((state = idleInitialRequestState) => state, fetchTenderRecommendationsReducer);