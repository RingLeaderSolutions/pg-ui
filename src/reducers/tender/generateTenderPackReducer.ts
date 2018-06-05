import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { idleInitialRequestState } from '../RequestState';

const generateTenderPackReducer = requestResponseReducer(
    types.GENERATE_TENDER_PACK_WORKING,
    types.GENERATE_TENDER_PACK_SUCCESSFUL,
    types.GENERATE_TENDER_PACK_FAILED,
    (state) => {
        return {
            ...state,
            working: false,  
            error: false
        };
    }
);

export default reduceReducers((state = idleInitialRequestState) => state, generateTenderPackReducer);