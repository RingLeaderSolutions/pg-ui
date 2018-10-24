import * as types from "./actionTypes";

import { Dispatch } from 'redux';
import { ApplicationTab, UtilityType } from "../model/Models";

import { push } from 'connected-react-router';
import { ModalDialogNames } from "../components/common/modal/ModalDialogNames";
import { AlertConfirmDialogData } from "../components/common/modal/AlertConfirmDialog";

export function toggleSidebarOpen(){
    return (dispatch: Dispatch<any>) => {
        dispatch( { type: types.TOGGLE_SIDEBAR_OPEN });
    };
}
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

export function selectAccountMeterTab(utility: UtilityType){
    return (dispatch: Dispatch<any>) => {
        dispatch( { type: types.SELECT_ACCOUNT_METER_TAB, data: utility });
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

export function selectTender(index: number){
    return (dispatch: Dispatch<any>) => {
        dispatch( { type: types.UPDATE_SELECTED_TENDER, data: index });
    };
}

export function selectTenderTab(index: number){
    return (dispatch: Dispatch<any>) => {
        dispatch( { type: types.SELECT_TENDER_TAB, data: index });
    };
}

export function redirectToPortfolio(portfolioId: string){
    let portfolioPath = `/portfolio/${portfolioId}`;
    return redirect(portfolioPath);
}

export function redirectToAccount(accountId: string){
    let portfolioPath = `/account/${accountId}`;
    return redirect(portfolioPath);
}

function redirect(path: string){
    return (dispatch: Dispatch<any>) => {
        dispatch(push(path))
    }
}

export function openAlertConfirmDialog(data: AlertConfirmDialogData){
    return (dispatch: Dispatch<any>) => {
        dispatch({ 
            type: types.OPEN_MODAL_DIALOG,
            dialog: {
                name: ModalDialogNames.AlertConfirm,
                open: true,
                data
            }});
    }
}

export function openAlertDialog(title: string, body: string){
    return (dispatch: Dispatch<any>) => {
        dispatch({ 
            type: types.OPEN_MODAL_DIALOG,
            dialog: {
                name: ModalDialogNames.Alert,
                open: true,
                data: { title, body }
            }});
    }
}

export function openDialog(name: string, data?: any){
    return (dispatch: Dispatch<any>) => {
        dispatch({ 
            type: types.OPEN_MODAL_DIALOG,
            dialog: {
                name,
                open: true,
                data: data
            }});
    }
}

export function closeDialog(name: string){
    return (dispatch: Dispatch<any>) => {
        dispatch({ 
            type: types.CLOSE_MODAL_DIALOG,
            dialog: {
                name,
                open: false
            }});
    }
}

export function toggleModalDialog(name: string){
    return (dispatch: Dispatch<any>) => {
        dispatch({ 
            type: types.TOGGLE_MODAL_DIALOG,
            dialog: {
                name
            }});
    }
}