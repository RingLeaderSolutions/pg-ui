import * as types from '../../actions/actionTypes';

import { MeterState } from './MeterState';


const meterEditor = (state: MeterState, action: any): MeterState => {
    switch (action.type) {
        case types.EDIT_METER:
            return {
                ...state,
                editedMeter: action.meter
            };
        case types.CANCEL_EDIT_METER:
            return {
                ...state,
                editedMeter: null
            };
        default:
            return state;
    }
}

export default meterEditor;