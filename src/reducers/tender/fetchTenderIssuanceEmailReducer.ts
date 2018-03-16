import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { RequestState, idleInitialRequestState } from '../RequestState';

const fetchTenderIssuanceEmailReducer = requestResponseReducer(
    types.FETCH_TENDER_ISSUANCE_EMAIL_WORKING,
    types.FETCH_TENDER_ISSUANCE_EMAIL_SUCCESSFUL,
    types.FETCH_TENDER_ISSUANCE_EMAIL_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,  
            error: false,     
            value: action.data
        };
    }
);

export default reduceReducers((state = idleInitialRequestState) => state, fetchTenderIssuanceEmailReducer);