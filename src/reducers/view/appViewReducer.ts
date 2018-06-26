import * as types from '../../actions/actionTypes';
import { reduceReducers } from '../common';
import { ApplicationTab } from '../../model/Models';

export interface ApplicationViewState {
    selectedTab: ApplicationTab;
}

const initialApplicationTabState = {
    selectedTab: ApplicationTab.Dashboard
}

const selectAppTabReducer = (state: ApplicationViewState, action: any): ApplicationViewState => {
    switch (action.type) {
        case types.SELECT_APPLICATION_TAB:
            return {
                ...state,
                selectedTab: action.data
            };
        default:
            return state;
    }
}

export const appViewReducer =  reduceReducers((state = initialApplicationTabState) => state, selectAppTabReducer);