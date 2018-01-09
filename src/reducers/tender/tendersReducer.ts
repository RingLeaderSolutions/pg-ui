import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { RequestState, initialRequestState } from '../RequestState';
import { Tender } from '../../model/Tender';

export interface TendersState extends RequestState {
    value: Tender[];
}

const tendersReducer = requestResponseReducer(
    types.FETCH_PORTFOLIO_TENDERS_WORKING,
    types.FETCH_PORTFOLIO_TENDERS_SUCCESSFUL,
    types.FETCH_PORTFOLIO_TENDERS_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,  
            error: false,          
            value: action.data
        };
    }
);

export default reduceReducers((state = initialRequestState) => state, tendersReducer);