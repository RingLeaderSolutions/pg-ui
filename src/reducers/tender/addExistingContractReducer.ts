import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { RequestState, initialRequestState } from '../RequestState';

const addExistingContractReducer = requestResponseReducer(
    types.TENDER_ADD_EXISTING_CONTRACT_WORKING,
    types.TENDER_ADD_EXISTING_CONTRACT_SUCCESSFUL,
    types.TENDER_ADD_EXISTING_CONTRACT_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,  
            error: false,          
            value: action.data
        };
    }
);

export default reduceReducers((state = initialRequestState) => state, addExistingContractReducer);