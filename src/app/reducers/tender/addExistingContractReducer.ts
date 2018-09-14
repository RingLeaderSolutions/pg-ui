import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { idleInitialRequestState } from '../RequestState';

const addExistingContractReducer = requestResponseReducer(
    types.TENDER_ADD_EXISTING_CONTRACT_WORKING,
    types.TENDER_ADD_EXISTING_CONTRACT_SUCCESSFUL,
    types.TENDER_ADD_EXISTING_CONTRACT_FAILED,
    (state) => {
        return {
            ...state,
            working: false,  
            error: false,     
        };
    }
);

export default reduceReducers((state = idleInitialRequestState) => state, addExistingContractReducer);