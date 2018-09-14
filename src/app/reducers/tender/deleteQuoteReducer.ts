import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { idleInitialRequestState } from '../RequestState';

const deleteQuoteReducer = requestResponseReducer(
    types.DELETE_QUOTE_WORKING,
    types.DELETE_QUOTE_SUCCESSFUL,
    types.DELETE_QUOTE_FAILED,
    (state) => {
        return {
            ...state,
            working: false,  
            error: false
        };
    }
);

export default reduceReducers((state = idleInitialRequestState) => state, deleteQuoteReducer);