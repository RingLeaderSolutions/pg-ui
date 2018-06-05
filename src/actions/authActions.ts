import AuthService from "../services/AuthService";
import * as types from "./actionTypes";

import { Dispatch } from 'redux';

export function login(email: string, password: string, redirectRoute?: string){
    return (dispatch: Dispatch<any>) => {
        dispatch({ type: types.USER_LOGIN_WORKING });
        
        AuthService.login(email, password, redirectRoute, error => {
            dispatch({ type: types.USER_LOGIN_FAILED, error });
        })
    };
}