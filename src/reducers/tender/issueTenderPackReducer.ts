import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { idleInitialRequestState } from '../RequestState';

const issueTenderPackReducer = requestResponseReducer(
    types.ISSUE_TENDER_PACK_WORKING,
    types.ISSUE_TENDER_PACK_SUCCESSFUL,
    types.ISSUE_TENDER_PACK_FAILED,
    (state) => {
        return {
            ...state,
            working: false,  
            error: false
        };
    }
);

export default reduceReducers((state = idleInitialRequestState) => state, issueTenderPackReducer);