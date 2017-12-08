import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { RequestState, initialRequestState } from '../RequestState';
import { MeterState } from './MeterState';

const meterReducer = requestResponseReducer(
    types.FETCH_METERS_WORKING,
    types.FETCH_METERS_SUCCESSFUL,
    types.FETCH_METERS_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,
            error: false,
            value: action.data
        };
    }
);



const meterEditor = (state: MeterState, action: any): MeterState => {
    switch (action.type) {
        case types.EDIT_METER:
            return {
                ...state,
                meter: action.meter
            };
        case types.CANCEL_EDIT_METER:
            return {
                ...state,
                meter: null
            };
        default:
            return state;
    }
}

export default reduceReducers((state = initialRequestState) => state, meterReducer, meterEditor);