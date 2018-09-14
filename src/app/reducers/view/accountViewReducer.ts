import * as types from '../../actions/actionTypes';
import { reduceReducers } from '../common';
import { initialSelectedTabState } from './ViewState';

export interface AccountViewState {
    selectedIndex: number;
}

const selectAccountTabReducer = (state: AccountViewState, action: any): AccountViewState => {
    switch (action.type) {
        case types.SELECT_ACCOUNT_TAB:
            return {
                ...state,
                selectedIndex: action.data
            };
        default:
            return state;
    }
}

export const accountViewReducer =  reduceReducers((state = initialSelectedTabState) => state, selectAccountTabReducer);