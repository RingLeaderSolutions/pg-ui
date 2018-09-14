import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { UploadReportsResponse } from '../../model/Models';
import { RequestState, initialRequestState } from '../RequestState';

export interface AccountUploadsState extends RequestState {
    value: UploadReportsResponse;
}

const accountUploadsReducer = requestResponseReducer(
    types.FETCH_ACCOUNT_UPLOADS_WORKING,
    types.FETCH_ACCOUNT_UPLOADS_SUCCESSFUL,
    types.FETCH_ACCOUNT_UPLOADS_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,         
            error: false,   
            value: action.data
        };
    }
);

export default reduceReducers((state = initialRequestState) => state, accountUploadsReducer);