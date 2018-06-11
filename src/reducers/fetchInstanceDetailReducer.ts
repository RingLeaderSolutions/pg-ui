import * as types from '../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from './common';
import { initialRequestState, RequestState } from './RequestState';
import { InstanceDetail } from '../model/Models';

export interface InstanceDetailState extends RequestState {
    value: InstanceDetail;
}

const fetchInstanceDetailReducer = requestResponseReducer(
    types.FETCH_INSTANCE_DETAILS_WORKING,
    types.FETCH_INSTANCE_DETAILS_SUCCESSFUL,
    types.FETCH_INSTANCE_DETAILS_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,
            error: false,
            value: action.data
        };
    }
);

export default reduceReducers((state = initialRequestState) => state, fetchInstanceDetailReducer);