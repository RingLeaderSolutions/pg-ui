import * as types from '../../actions/actionTypes';
import { reduceReducers } from '../common';
import { UtilityType } from '../../model/Models';

export interface AccountViewState {
    selectedIndex: number;
    selectedMeterTab: UtilityType;
}

const initialAccountViewState = {
    selectedIndex: 0,
    selectedMeterTab: UtilityType.Electricity
};

const selectAccountTabReducer = (state: AccountViewState, action: any): AccountViewState => {
    switch (action.type) {
        case types.SELECT_ACCOUNT_TAB:
            return {
                ...state,
                selectedIndex: action.data
            };

        case types.SELECT_ACCOUNT_METER_TAB:
            return {
                ...state,
                selectedMeterTab: action.data
            };
        default:
            return state;
    }
}

export const accountViewReducer =  reduceReducers((state = initialAccountViewState) => state, selectAccountTabReducer);