import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { RequestState, idleInitialRequestState } from '../RequestState';
import { RecommendationSummary } from '../../model/Tender';

export interface RecommendationSummaryState extends RequestState {
    value: RecommendationSummary;
}

const fetchRecommendationSummaryReducer = requestResponseReducer(
    types.FETCH_RECOMMENDATIONS_SUMMARY_WORKING,
    types.FETCH_RECOMMENDATIONS_SUMMARY_SUCCESSFUL,
    types.FETCH_RECOMMENDATIONS_SUMMARY_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,  
            error: false,     
            value: action.data
        };
    }
);

export default reduceReducers((state = idleInitialRequestState) => state, fetchRecommendationSummaryReducer);