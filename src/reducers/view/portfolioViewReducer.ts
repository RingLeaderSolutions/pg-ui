import * as types from '../../actions/actionTypes';
import { reduceReducers } from '../common';
import { initialSelectedTabState } from './ViewState';

export interface PortfolioViewState {
    selectedIndex: number;
    tender: TenderViewState;
    meter: MeterViewState;
}

export interface TenderViewState {
    selectedIndex: number;
}

export interface MeterViewState {
    selectedIndex: number;
}

const initialPortfolioViewState : PortfolioViewState = {
    ...initialSelectedTabState,
    tender: initialSelectedTabState,
    meter: initialSelectedTabState,
}

const selectPortfolioTabReducer = (state: PortfolioViewState, action: any): PortfolioViewState => {
    switch (action.type) {
        case types.SELECT_PORTFOLIO_TAB:
            return {
                ...state,
                selectedIndex: action.data
            };
        case types.SELECT_PORTFOLIO_METER_TAB:
            return {
                ...state,
                meter: {
                    selectedIndex: action.data
                }
            };
        case types.SELECT_PORTFOLIO_TENDER_TAB:
            return {
                ...state,
                tender: {
                    selectedIndex: action.data
                }
            };
        default:
            return state;
    }
}

export const portfolioViewReducer =  reduceReducers((state = initialPortfolioViewState) => state, selectPortfolioTabReducer);
