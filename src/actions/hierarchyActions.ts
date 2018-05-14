import ApiService from "../services/ApiService";
import { Account, AccountDetail } from "../Model/Models";

import * as types from "./actionTypes";
import { makeApiRequest } from "./Common";

import { Dispatch } from 'redux';

export function retrieveAccounts(){
    return (dispatch: Dispatch<any>) => {
        let fetchPromise = ApiService.retrieveAccounts();
        dispatch({ type: types.RETRIEVE_ACCOUNTS_WORKING });
        
        makeApiRequest(dispatch,
            fetchPromise,
            200, 
            data => {
                return { type: types.RETRIEVE_ACCOUNTS_SUCCESSFUL, data: data as Account[] };
            }, 
            error => {
                return { type: types.RETRIEVE_ACCOUNTS_FAILED, errorMessage: error };
            });
    };
}

export function retrieveAccountDetail(accountId: string){
    return (dispatch: Dispatch<any>) => {
        let fetchPromise = ApiService.retrieveAccountDetail(accountId);
        dispatch({ type: types.RETRIEVE_ACCOUNT_DETAIL_WORKING });
        
        makeApiRequest(dispatch,
            fetchPromise,
            200, 
            data => {
                return { type: types.RETRIEVE_ACCOUNT_DETAIL_SUCCESSFUL, data: data as AccountDetail };
            }, 
            error => {
                return { type: types.RETRIEVE_ACCOUNT_DETAIL_FAILED, errorMessage: error };
            });
    };
}

export function createAccount(account: Account){
    return (dispatch: Dispatch<any>) => {
        let createPromise = ApiService.createAccount(account);
        dispatch( { type: types.CREATE_ACCOUNT_WORKING });

        makeApiRequest(dispatch,
            createPromise,
            201, 
            data => {
                return { type: types.CREATE_ACCOUNT_SUCCESSFUL, data};
                
            }, 
            error => {
                return { type: types.CREATE_ACCOUNT_FAILED, errorMessage: error };
            });
    };
}

export function updateAccount(account: Account){
    return (dispatch: Dispatch<any>) => {
        let createPromise = ApiService.updateAccount(account);
        dispatch( { type: types.UPDATE_ACCOUNT_WORKING });

        makeApiRequest(dispatch,
            createPromise,
            201, 
            data => {
                return { type: types.UPDATE_ACCOUNT_SUCCESSFUL, data};
                
            }, 
            error => {
                return { type: types.UPDATE_ACCOUNT_FAILED, errorMessage: error };
            });
    };
}