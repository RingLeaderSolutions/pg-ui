import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { RequestState, idleInitialRequestState } from '../RequestState';
import { RecommendationSite } from '../../model/Tender';

export interface RecommendationSitesState extends RequestState {
    value: RecommendationSite[];
}

const fetchRecommendationSitesReducer = requestResponseReducer(
    types.FETCH_RECOMMENDATIONS_SITES_WORKING,
    types.FETCH_RECOMMENDATIONS_SITES_SUCCESSFUL,
    types.FETCH_RECOMMENDATIONS_SITES_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,  
            error: false,     
            value: action.data
        };
    }
);

export default reduceReducers((state = idleInitialRequestState) => state, fetchRecommendationSitesReducer);