import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { RequestState, initialRequestState } from '../RequestState';

const meterReducer = requestResponseReducer(
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

export default reduceReducers((state = initialRequestState) => state, meterReducer);