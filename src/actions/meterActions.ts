import ApiService from "../services/ApiService";

import { Mpan, MeterPortfolio } from "../Model/Meter";

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
                return { type: types.FETCH_METERS_SUCCESSFUL, data: data as MeterPortfolio };
            }, 
            error => {
                return { type: types.FETCH_METERS_FAILED, errorMessage: error };
            });
    }
};


export function editMeter(meter: Mpan){
    return (dispatch: Dispatch<any>) => {
        dispatch({ 
            type: types.EDIT_METER,
            meter: meter
        });
    };
};


export function cancelEditMeter(){
    return (dispatch: Dispatch<any>) => {
        dispatch({ 
            type: types.CANCEL_EDIT_METER
        });
    };
};

export function updateMeter(portfolioId: string, meter: Mpan){
    return (dispatch: Dispatch<any>) => {
        let createPromise = ApiService.updateMeter(portfolioId, meter);
        dispatch({ type: types.UPDATE_PORTFOLIO_METER_WORKING });

        makeApiRequest(dispatch,
            createPromise,
            200, 
            data => {
                return { type: types.UPDATE_PORTFOLIO_METER_SUCCESSFUL, data: null};
                
            }, 
            error => {
                return { type: types.UPDATE_PORTFOLIO_METER_FAILED, errorMessage: error };
            });
    };
}

export function excludeMeters(portfolioId: string, meters: string[]){
    return (dispatch: Dispatch<any>) => {
        let excludePromise = ApiService.excludeMeters(portfolioId, meters);
        dispatch({ type: types.EXCLUDE_METERS_WORKING });

        makeApiRequest(dispatch,
            excludePromise,
            200, 
            data => {
                return { type: types.EXCLUDE_METERS_SUCCESSFUL, data: null};
                
            }, 
            error => {
                return { type: types.EXCLUDE_METERS_FAILED, errorMessage: error };
            });
    };
}