import * as types from '../../actions/actionTypes';
import { reduceReducers } from '../common';
import { ApplicationTab } from '../../model/Models';

export interface ApplicationViewState {
    selectedTab: ApplicationTab;
    sidebar_open: boolean;
}

const initialApplicationTabState = {
    selectedTab: ApplicationTab.Dashboard,
    sidebar_open: false
}

const selectAppTabReducer = (state: ApplicationViewState, action: any): ApplicationViewState => {
    switch (action.type) {
        case types.SELECT_APPLICATION_TAB:
            return {
                ...state,
                selectedTab: action.data
            };
        case types.TOGGLE_SIDEBAR_OPEN:
            return {
                ...state,
                sidebar_open: !state.sidebar_open
            };
        default:
            return state;
    }
}

export const appViewReducer =  reduceReducers((state = initialApplicationTabState) => state, selectAppTabReducer);