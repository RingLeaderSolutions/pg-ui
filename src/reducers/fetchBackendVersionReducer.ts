import * as types from '../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from './common';
import { idleInitialRequestState } from './RequestState';

const fetchBackendVersionReducer = requestResponseReducer(
    types.FETCH_BACKEND_VERSION_WORKING,
    types.FETCH_BACKEND_VERSION_SUCCESSFUL,
    types.FETCH_BACKEND_VERSION_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,
            error: false,
            value: action.data
        };
    }
);

export default reduceReducers((state = idleInitialRequestState) => state, fetchBackendVersionReducer);