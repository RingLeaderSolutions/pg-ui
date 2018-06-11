import ApiService from "../services/apiService";
import { Account, AccountDetail, UploadResponse, UploadReportsResponse, CompanyInfo } from "../Model/Models";

import * as types from "./actionTypes";
import { makeApiRequest } from "./Common";

import { Dispatch } from 'redux';
import { AccountContact, AccountDocument } from "../model/HierarchyObjects";

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
            200, 
            data => {
                return { type: types.UPDATE_ACCOUNT_SUCCESSFUL, data};
                
            }, 
            error => {
                return { type: types.UPDATE_ACCOUNT_FAILED, errorMessage: error };
            });
    };
}

export function createContact(contact: AccountContact){
    return (dispatch: Dispatch<any>) => {
        let createPromise = ApiService.createContact(contact);
        dispatch( { type: types.CREATE_ACCOUNT_CONTACT_WORKING });

        makeApiRequest(dispatch,
            createPromise,
            201, 
            data => {
                return { type: types.CREATE_ACCOUNT_CONTACT_SUCCESSFUL, data};
                
            }, 
            error => {
                return { type: types.CREATE_ACCOUNT_CONTACT_FAILED, errorMessage: error };
            });
    };
}

export function updateContact(contact: AccountContact){
    return (dispatch: Dispatch<any>) => {
        let createPromise = ApiService.updateContact(contact);
        dispatch( { type: types.UPDATE_ACCOUNT_CONTACT_WORKING });

        makeApiRequest(dispatch,
            createPromise,
            200, 
            data => {
                return { type: types.UPDATE_ACCOUNT_CONTACT_SUCCESSFUL, data};
                
            }, 
            error => {
                return { type: types.UPDATE_ACCOUNT_CONTACT_FAILED, errorMessage: error };
            });
    };
}

export function deleteContact(accountContactId: string){
    return (dispatch: Dispatch<any>) => {
        let createPromise = ApiService.deleteContact(accountContactId);
        dispatch( { type: types.DELETE_ACCOUNT_CONTACT_WORKING });

        makeApiRequest(dispatch,
            createPromise,
            200, 
            data => {
                return { type: types.DELETE_ACCOUNT_CONTACT_SUCCESSFUL, data};
                
            }, 
            error => {
                return { type: types.DELETE_ACCOUNT_CONTACT_FAILED, errorMessage: error };
            });
    };
}

export function fetchAccountDocumentation(accountId: string){
    return (dispatch: Dispatch<any>) => {
        let createPromise = ApiService.fetchAccountDocumentation(accountId);
        dispatch( { type: types.FETCH_ACCOUNT_DOCUMENTATION_WORKING });

        makeApiRequest(dispatch,
            createPromise,
            200, 
            data => {
                return { type: types.FETCH_ACCOUNT_DOCUMENTATION_SUCCESSFUL, data: data as AccountDocument[]};
                
            }, 
            error => {
                return { type: types.FETCH_ACCOUNT_DOCUMENTATION_FAILED, errorMessage: error };
            });
    };
}

export function uploadAccountDocument(accountId: string, documentType: string, file: Blob){
    return (dispatch: Dispatch<any>) => {
        let uploadPromise = ApiService.uploadAccountDocument(accountId, file);
        dispatch({ type: types.UPLOAD_ACCOUNT_DOCUMENTATION_WORKING });

        makeApiRequest(dispatch,
            uploadPromise,
            200, 
            data => {
                var uploadResponse = data as UploadResponse;
                ApiService.reportSuccessfulAccountDocumentUpload(accountId, documentType, uploadResponse.uploadedFiles);
                return { type: types.UPLOAD_ACCOUNT_DOCUMENTATION_SUCCESSFUL, data: null};
                
            }, 
            error => {
                return { type: types.UPLOAD_ACCOUNT_DOCUMENTATION_FAILED, errorMessage: error };
            });
    };
}

export function fetchAccountUploads(accountId: string){
    return (dispatch: Dispatch<any>) => {
        let createPromise = ApiService.fetchAccountUploads(accountId);
        dispatch( { type: types.FETCH_ACCOUNT_UPLOADS_WORKING });

        makeApiRequest(dispatch,
            createPromise,
            200, 
            data => {
                return { type: types.FETCH_ACCOUNT_UPLOADS_SUCCESSFUL, data: data as UploadReportsResponse};
                
            }, 
            error => {
                return { type: types.FETCH_ACCOUNT_UPLOADS_FAILED, errorMessage: error };
            });
    };
}


export function selectCompanySearchMethod(){
    return (dispatch: Dispatch<any>) => {
        dispatch( { type: types.SELECT_METHOD_COMPANY_SEARCH });
    };
}

export function selectManualMethod(){
    return (dispatch: Dispatch<any>) => {
        dispatch( { type: types.SELECT_METHOD_MANUAL });
    };
}

export function searchCompany(registrationNumber: string){
    return (dispatch: Dispatch<any>) => {
        let searchPromise = ApiService.searchCompany(registrationNumber);
        dispatch( { type: types.COMPANY_SEARCH_WORKING });

        makeApiRequest(dispatch,
            searchPromise,
            200, 
            data => {
                return { type: types.COMPANY_SEARCH_SUCCESSFUL, data: data as CompanyInfo};
                
            }, 
            error => {
                return { type: types.COMPANY_SEARCH_FAILED, errorMessage: error };
            });
    };
}

export function clearCompany(){
    return (dispatch: Dispatch<any>) => {
        dispatch( { type: types.COMPANY_SEARCH_CLEAR });
    };
}

export function selectCompany(){
    return (dispatch: Dispatch<any>) => {
        dispatch( { type: types.COMPANY_SEARCH_SELECTED });
    };
}

export function clearAccountCreation(){
    return (dispatch: Dispatch<any>) => {
        dispatch( { type: types.CREATE_ACCOUNT_CLEAR });
    };
}

export function fetchAccountPortfolios(accountId: string){
    return (dispatch: Dispatch<any>) => {
        let createPromise = ApiService.fetchAccountPortfolios(accountId);
        dispatch( { type: types.FETCH_ACCOUNT_PORTFOLIOS_WORKING });

        makeApiRequest(dispatch,
            createPromise,
            200, 
            data => {
                return { type: types.FETCH_ACCOUNT_PORTFOLIOS_SUCCESSFUL, data};
                
            }, 
            error => {
                return { type: types.FETCH_ACCOUNT_PORTFOLIOS_FAILED, errorMessage: error };
            });
    };
}
