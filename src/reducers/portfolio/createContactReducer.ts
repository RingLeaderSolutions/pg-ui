import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { PortfolioDetails } from '../../model/Models';
import { RequestState, idleInitialRequestState } from '../RequestState';

const addContactReducer = requestResponseReducer(
    types.CREATE_PORTFOLIO_CONTACT_WORKING,
    types.CREATE_PORTFOLIO_CONTACT_SUCCESSFUL,
    types.CREATE_PORTFOLIO_CONTACT_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,
            error: false,
        };
    }
);

export default reduceReducers((state = idleInitialRequestState) => state, addContactReducer);