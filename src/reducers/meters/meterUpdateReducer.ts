import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { RequestState, initialRequestState } from '../RequestState';

export interface MeterUpdateState extends RequestState {
}

const meterUpdateReducer = requestResponseReducer(
    types.UPDATE_PORTFOLIO_METER_WORKING,
    types.UPDATE_PORTFOLIO_METER_SUCCESSFUL,
    types.UPDATE_PORTFOLIO_METER_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,         
            error: false,   
            value: action.data
        };
    }
);

export default reduceReducers((state = initialRequestState) => state, meterUpdateReducer);