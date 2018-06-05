import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { idleInitialRequestState } from '../RequestState';

const addContactReducer = requestResponseReducer(
    types.CREATE_PORTFOLIO_CONTACT_WORKING,
    types.CREATE_PORTFOLIO_CONTACT_SUCCESSFUL,
    types.CREATE_PORTFOLIO_CONTACT_FAILED,
    (state) => {
        return {
            ...state,
            working: false,
            error: false,
        };
    }
);

export default reduceReducers((state = idleInitialRequestState) => state, addContactReducer);