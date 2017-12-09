import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { RequestState, initialRequestState } from '../RequestState';
import { MeterPortfolio, Meter } from '../../model/Meter';

export interface MetersRetrievalState extends RequestState {
    value: MeterPortfolio;
}

const metersRetrievalReducer = requestResponseReducer(
    types.FETCH_METERS_WORKING,
    types.FETCH_METERS_SUCCESSFUL,
    types.FETCH_METERS_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,
            error: false,
            value: action.data
        };
    }
);

export default reduceReducers((state = initialRequestState) => state, metersRetrievalReducer);