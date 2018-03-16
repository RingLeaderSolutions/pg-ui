import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { RequestState, idleInitialRequestState } from '../RequestState';

const fetchTariffsReducer = requestResponseReducer(
    types.FETCH_TARIFFS_WORKING,
    types.FETCH_TARIFFS_SUCCESSFUL,
    types.FETCH_TARIFFS_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,  
            error: false,     
            value: action.data
        };
    }
);

export default reduceReducers((state = idleInitialRequestState) => state, fetchTariffsReducer);