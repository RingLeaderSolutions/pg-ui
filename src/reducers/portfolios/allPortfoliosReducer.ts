import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { Portfolio } from '../../model/Models';
import { initialRequestState } from '../RequestState';
import { RequestState } from '../RequestState';

export interface AllPortfoliosState extends RequestState {
    value: Portfolio[];
}

const allPortfoliosReducer = requestResponseReducer(
    types.FETCH_PORTFOLIOS_WORKING,
    types.FETCH_PORTFOLIOS_SUCCESSFUL,
    types.FETCH_PORTFOLIOS_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,     
            error: false,       
            value: action.data
        };
    }
);

export default reduceReducers((state = initialRequestState) => state, allPortfoliosReducer);