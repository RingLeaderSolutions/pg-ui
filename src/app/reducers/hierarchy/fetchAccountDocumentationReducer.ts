import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { AccountDocument } from '../../model/Models';
import { RequestState, initialRequestState } from '../RequestState';

export interface AccountDocumentationState extends RequestState {
    value: AccountDocument[];
}

const fetchAccountDocumentationReducer = requestResponseReducer(
    types.FETCH_ACCOUNT_DOCUMENTATION_WORKING,
    types.FETCH_ACCOUNT_DOCUMENTATION_SUCCESSFUL,
    types.FETCH_ACCOUNT_DOCUMENTATION_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,     
            error: false,       
            value: action.data
        };
    }
);

export default reduceReducers((state = initialRequestState) => state, fetchAccountDocumentationReducer);