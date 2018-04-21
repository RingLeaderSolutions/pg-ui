import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { AccountDetail } from '../../model/Models';
import { RequestState, initialRequestState } from '../RequestState';

export interface AccountDetailState extends RequestState {
    value: AccountDetail;
}

const retrieveAccountDetailReducer = requestResponseReducer(
    types.RETRIEVE_ACCOUNT_DETAIL_WORKING,
    types.RETRIEVE_ACCOUNT_DETAIL_SUCCESSFUL,
    types.RETRIEVE_ACCOUNT_DETAIL_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,     
            error: false,       
            value: action.data
        };
    }
);

export default reduceReducers((state = initialRequestState) => state, retrieveAccountDetailReducer);