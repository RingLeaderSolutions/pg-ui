import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { idleInitialRequestState } from '../RequestState';

const updateRequirementsReducer = requestResponseReducer(
    types.UPDATE_PORTFOLIO_REQUIREMENTS_WORKING,
    types.UPDATE_PORTFOLIO_REQUIREMENTS_SUCCESSFUL,
    types.UPDATE_PORTFOLIO_REQUIREMENTS_FAILED,
    (state) => {
        return {
            ...state,
            working: false,
            error: false,
        };
    }
);

export default reduceReducers((state = idleInitialRequestState) => state, updateRequirementsReducer);