import * as types from '../../actions/actionTypes';
import { reduceReducers } from '../common';
import { initialSelectedTabState } from './ViewState';

export interface PortfolioViewState {
    selectedIndex: number;
    tender: TenderViewState;
    meter: MeterViewState;
    offers: OffersViewState;
    recommendations: RecommendationsViewState;
}

export interface RecommendationsViewState {
    selectedIndex: number;
}

export interface OffersViewState {
    selectedIndex: number;
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
    offers: initialSelectedTabState,
    recommendations: initialSelectedTabState
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
        case types.SELECT_TENDER_OFFERS_TAB:
            return {
                ...state,
                offers: {
                    selectedIndex: action.data
                }
            };
        case types.SELECT_TENDER_RECOMMENDATIONS_TAB:
            return {
                ...state,
                recommendations: {
                    selectedIndex: action.data
                }
            };
        default:
            return state;
    }
}

export const portfolioViewReducer =  reduceReducers((state = initialPortfolioViewState) => state, selectPortfolioTabReducer);
