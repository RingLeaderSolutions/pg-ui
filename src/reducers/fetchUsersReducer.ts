import * as types from '../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from './common';
import { PortfolioDetails, User } from '../model/Models';
import { RequestState, idleInitialRequestState } from './RequestState';

export interface UsersState extends RequestState {
    value: User[];
}

const fetchUsersReducer = requestResponseReducer(
    types.FETCH_USERS_WORKING,
    types.FETCH_USERS_SUCCESSFUL,
    types.FETCH_USERS_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,
            error: false,
            value: action.data
        };
    }
);

export default reduceReducers((state = idleInitialRequestState) => state, fetchUsersReducer);