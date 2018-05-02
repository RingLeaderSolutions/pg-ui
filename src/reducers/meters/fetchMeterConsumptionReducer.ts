import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { RequestState, initialRequestState } from '../RequestState';
import { MeterPortfolio, MeterConsumptionSummary } from '../../model/Meter';

export interface MeterConsumptionState extends RequestState {
    value: MeterConsumptionSummary;
}

const fetchMeterConsumptionReducer = requestResponseReducer(
    types.FETCH_METER_CONSUMPTION_WORKING,
    types.FETCH_METER_CONSUMPTION_SUCCESSFUL,
    types.FETCH_METER_CONSUMPTION_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,
            error: false,
            value: action.data
        };
    }
);

export default reduceReducers((state = initialRequestState) => state, fetchMeterConsumptionReducer);