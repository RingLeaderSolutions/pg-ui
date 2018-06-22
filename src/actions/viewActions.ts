import * as types from "./actionTypes";

import { Dispatch } from 'redux';

export function selectAccountTab(index: number){
    return (dispatch: Dispatch<any>) => {
        dispatch( { type: types.SELECT_ACCOUNT_TAB, data: index });
    };
}

export function selectPortfolioTab(index: number){
    return (dispatch: Dispatch<any>) => {
        dispatch( { type: types.SELECT_PORTFOLIO_TAB, data: index });
    };
}

export function selectPortfolioMeterTab(index: number){
    return (dispatch: Dispatch<any>) => {
        dispatch( { type: types.SELECT_PORTFOLIO_METER_TAB, data: index });
    };
}

export function selectPortfolioTenderTab(index: number){
    return (dispatch: Dispatch<any>) => {
        dispatch( { type: types.SELECT_PORTFOLIO_TENDER_TAB, data: index });
    };
}