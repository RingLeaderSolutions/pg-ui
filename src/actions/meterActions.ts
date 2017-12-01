import ApiService from "../services/ApiService";

import { Meter } from "../Model/Meter";

import * as types from "./actionTypes";
import { Dispatch } from 'redux';

import { makeApiRequest } from "./Common";


export function getMeters(portfolioId: string){    
    return (dispatch: Dispatch<any>) => {
        let fetchPromise = ApiService.getAllMeters(portfolioId);
        dispatch( { type: types.FETCH_METERS_WORKING });

        makeApiRequest(dispatch,
            fetchPromise,
            200, 
            data => {
                return { type: types.FETCH_METERS_SUCCESSFUL, data: data as Meter[] };
            }, 
            error => {
                return { type: types.FETCH_METERS_FAILED, errorMessage: error };
            });
    }
};