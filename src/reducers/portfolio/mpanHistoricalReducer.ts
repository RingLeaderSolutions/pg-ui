import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { MpanHistorical } from '../../model/Models';
import { RequestState, initialRequestState } from '../RequestState';

export interface MpanHistoricalState extends RequestState {
    value: MpanHistorical;
}

const mpanHistoricalReducer = requestResponseReducer(
    types.FETCH_MPAN_HISTORICAL_WORKING,
    types.FETCH_MPAN_HISTORICAL_SUCCESSFUL,
    types.FETCH_MPAN_HISTORICAL_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,         
            error: false,   
            value: action.data
        };
    }
);

export default reduceReducers((state = initialRequestState) => state, mpanHistoricalReducer);