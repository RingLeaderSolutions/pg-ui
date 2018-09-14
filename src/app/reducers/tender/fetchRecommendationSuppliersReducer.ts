import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { RequestState, idleInitialRequestState } from '../RequestState';
import { RecommendationSupplier } from '../../model/Tender';

export interface RecommendationSuppliersState extends RequestState {
    value: RecommendationSupplier[];
}

const fetchRecommendationSuppliersReducer = requestResponseReducer(
    types.FETCH_RECOMMENDATIONS_SUPPLIERS_WORKING,
    types.FETCH_RECOMMENDATIONS_SUPPLIERS_SUCCESSFUL,
    types.FETCH_RECOMMENDATIONS_SUPPLIERS_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,  
            error: false,     
            value: action.data
        };
    }
);

export default reduceReducers((state = idleInitialRequestState) => state, fetchRecommendationSuppliersReducer);