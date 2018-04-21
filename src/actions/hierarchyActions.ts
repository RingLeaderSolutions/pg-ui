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
