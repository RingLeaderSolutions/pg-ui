import ApiService from "../services/apiService";

import { MeterConsumptionSummary } from "../model/Meter";

import * as types from "./actionTypes";
import { Dispatch } from 'redux';

import { makeApiRequest } from "./common";
import { ExportResponse } from "../model/Models";


export function includeMeters(portfolioId: string, meters: string[]){
    return (dispatch: Dispatch<any>) => {
        let includePromise = ApiService.includeMeters(portfolioId, meters);
        dispatch({ type: types.INCLUDE_METERS_WORKING });

        makeApiRequest(dispatch,
            includePromise,
            200, 
            data => {
                return { type: types.INCLUDE_METERS_SUCCESSFUL, data: null};
                
            }, 
            error => {
                return { type: types.INCLUDE_METERS_FAILED, errorMessage: error };
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

export function fetchMeterConsumption(portfolioId: string){    
    return (dispatch: Dispatch<any>) => {
        let fetchPromise = ApiService.fetchMeterConsumption(portfolioId);
        dispatch( { type: types.FETCH_METER_CONSUMPTION_WORKING });

        makeApiRequest(dispatch,
            fetchPromise,
            200, 
            data => {
                return { type: types.FETCH_METER_CONSUMPTION_SUCCESSFUL, data: data as MeterConsumptionSummary };
            }, 
            error => {
                return { type: types.FETCH_METER_CONSUMPTION_FAILED, errorMessage: error };
            });
    }
};

export function exportMeterConsumption(portfolioId: string){    
    return (dispatch: Dispatch<any>) => {
        let fetchPromise = ApiService.exportMeterConsumption(portfolioId);
        dispatch( { type: types.EXPORT_METER_CONSUMPTION_WORKING });

        makeApiRequest(dispatch,
            fetchPromise,
            200, 
            data => {
                var resp = data as ExportResponse;
                window.open(resp.exportUri, '_blank');
                return { type: types.EXPORT_METER_CONSUMPTION_SUCCESSFUL, data: data};
            }, 
            error => {
                return { type: types.EXPORT_METER_CONSUMPTION_FAILED, errorMessage: error };
            });
    }
};