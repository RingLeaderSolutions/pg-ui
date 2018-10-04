
import * as types from "./actionTypes";

import { Dispatch } from 'redux';
import { BackendVersion } from "../model/Models";
import { makeApiRequest } from "./common";
import ApiService from "../services/apiService";
import AuthenticationService from "../services/AuthenticationService";
import { push } from 'connected-react-router';

export function completeLogin(urlHash: string) {
    return async (dispatch: Dispatch<any>) => {
        try {
            var preservedState = await AuthenticationService.parseRedirectHash(urlHash);
            await ApiService.reportLogin();

            let nextLocation = preservedState.intendedPath || '/';
            console.log(`Login complete, redirecting user to [${nextLocation}]`)
            dispatch(push(nextLocation));
        }
        catch(ex){
            console.error('Encountered error parsing redirect hash and reporting login:', ex);
            dispatch(push('/error'));
        }
    }
}

export function login(email: string, password: string, intendedPath?: string){
    return async (dispatch: Dispatch<any>) => {
        dispatch({ type: types.USER_LOGIN_WORKING });
        
        try {
            await AuthenticationService.login(email, password, intendedPath);
        }
        catch(ex) {
            dispatch({ type: types.USER_LOGIN_FAILED, ex })
        }
    };
}

export function fetchBackendVersion(){
    return (dispatch: Dispatch<any>) => {
        let fetchVersionPromise = ApiService.fetchBackendVersion();
        dispatch({ type: types.FETCH_BACKEND_VERSION_WORKING });

        setTimeout(() => {
            makeApiRequest(dispatch,
                fetchVersionPromise,
                200, 
                data => {
                    return { type: types.FETCH_BACKEND_VERSION_SUCCESSFUL, data: (data as BackendVersion).version};
                }, 
                error => {
                    return { type: types.FETCH_BACKEND_VERSION_FAILED, errorMessage: error };
                });
        }, 2000);
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