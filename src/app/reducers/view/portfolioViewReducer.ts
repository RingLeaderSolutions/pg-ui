import * as types from '../../actions/actionTypes';
import { reduceReducers } from '../common';

export interface PortfolioViewState {
    selectedTabIndex: number;
    selectedTenderIndex: number;
    selectedTenderTabIndex: number;
    selectedMeterUtilityIndex: number;
}

export interface TenderViewState {
    selectedIndex: number;
}

export interface MeterViewState {
    selectedIndex: number;
}

const initialPortfolioViewState : PortfolioViewState = {
    selectedTabIndex: 0,
    selectedTenderIndex: 0,
    selectedTenderTabIndex: 0,
    selectedMeterUtilityIndex: 0
}

const selectPortfolioTabReducer = (state: PortfolioViewState, action: any): PortfolioViewState => {
    switch (action.type) {
        case types.SELECT_PORTFOLIO_TAB:
            return {
                ...state,
                selectedTabIndex: action.data
            };
        case types.SELECT_PORTFOLIO_METER_TAB:
            return {
                ...state,
                selectedMeterUtilityIndex: action.data
            };
        case types.UPDATE_SELECTED_TENDER:
            return {
                ...state,
                selectedTenderIndex: action.data
            };
        case types.SELECT_TENDER_TAB:
            return {
                ...state,
                selectedTenderTabIndex: action.data
            };
        default:
            return state;
    }
}

export const portfolioViewReducer =  reduceReducers((state = initialPortfolioViewState) => state, selectPortfolioTabReducer);
