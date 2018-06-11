import AuthService from "../services/AuthService";
import * as types from "./actionTypes";

import { Dispatch } from 'redux';
import { BackendVersion } from "../model/Models";
import { makeApiRequest } from "./Common";
import ApiService from "../services/apiService";

export function login(email: string, password: string, redirectRoute?: string){
    return (dispatch: Dispatch<any>) => {
        dispatch({ type: types.USER_LOGIN_WORKING });
        
        AuthService.login(email, password, redirectRoute, error => {
            dispatch({ type: types.USER_LOGIN_FAILED, error });
        })
    };
}

export function fetchBackendVersion(){
    return (dispatch: Dispatch<any>) => {
        let fetchVersionPromise = ApiService.fetchBackendVersion();
        dispatch({ type: types.FETCH_BACKEND_VERSION_WORKING });

        makeApiRequest(dispatch,
            fetchVersionPromise,
            200, 
            data => {
                return { type: types.FETCH_BACKEND_VERSION_SUCCESSFUL, data: (data as BackendVersion).version};
                
            }, 
            error => {
                return { type: types.FETCH_BACKEND_VERSION_FAILED, errorMessage: error };
            });
    };
}

export function fetchInstanceDetails(){
    return (dispatch: Dispatch<any>) => {
        let fetchVersionPromise = ApiService.fetchInstanceDetails();
        dispatch({ type: types.FETCH_INSTANCE_DETAILS_WORKING });

        makeApiRequest(dispatch,
            fetchVersionPromise,
            200, 
            data => {
                return { type: types.FETCH_INSTANCE_DETAILS_SUCCESSFUL, data: data};
                
            }, 
            error => {
                return { type: types.FETCH_INSTANCE_DETAILS_FAILED, errorMessage: error };
            });
    };
}