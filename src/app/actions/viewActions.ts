import * as types from "./actionTypes";

import { Dispatch } from 'redux';
import { ApplicationTab } from "../model/Models";

export function selectApplicationTab(tab: ApplicationTab){
    return (dispatch: Dispatch<any>) => {
        dispatch( { type: types.SELECT_APPLICATION_TAB, data: tab });
    };
}

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

export function selectTenderOffersTab(index: number){
    return (dispatch: Dispatch<any>) => {
        dispatch( { type: types.SELECT_TENDER_OFFERS_TAB, data: index });
    };
}

export function selectTenderRecommendationsTab(index: number){
    return (dispatch: Dispatch<any>) => {
        dispatch( { type: types.SELECT_TENDER_RECOMMENDATIONS_TAB, data: index });
    };
}

export function openModalDialog(modalId: string){
    return (dispatch: Dispatch<any>) => {
        dispatch( { type: types.OPEN_MODAL_DIALOG, data: modalId });
    };
}

export function closeModalDialog(){
    return (dispatch: Dispatch<any>) => {
        dispatch( { type: types.CLOSE_MODAL_DIALOG, data: null });
    };
}