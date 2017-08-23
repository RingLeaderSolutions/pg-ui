import ApiService from "../services/ApiService";
import { Portfolio, PortfoliosSummary, PortfoliosStatus, PortfoliosTimeline } from "../Model/Models";

import * as types from "./actionTypes";
import { makeApiRequest } from "./Common";

import { Dispatch } from 'redux';

export function getAllPortfolios(){
    return (dispatch: Dispatch<any>) => {
        let fetchPromise = ApiService.getAllPortfolios();
        dispatch( { type: types.FETCH_PORTFOLIOS_WORKING });

        makeApiRequest(dispatch,
            fetchPromise,
            200, 
            data => {
                return { type: types.FETCH_PORTFOLIOS_SUCCESSFUL, data: data as Portfolio[] };
            }, 
            error => {
                return { type: types.FETCH_PORTFOLIOS_FAILED, errorMessage: error };
            });
    };
}

export function getPortfoliosSummary(){
    return (dispatch: Dispatch<any>) => {
        let fetchPromise = ApiService.getAllPortfolioSummary();
        dispatch({ type: types.FETCH_PORTFOLIOS_SUMMARY_WORKING });
        
        makeApiRequest(dispatch,
            fetchPromise,
            200, 
            data => {
                return { type: types.FETCH_PORTFOLIOS_SUMMARY_SUCCESSFUL, data: data as PortfoliosSummary };
            }, 
            error => {
                return { type: types.FETCH_PORTFOLIOS_SUMMARY_FAILED, errorMessage: error };
            });
    };
}

export function getPortfoliosStatus(){
    return (dispatch: Dispatch<any>) => {
        let fetchPromise = ApiService.getAllPortfolioStatus();
        dispatch({ type: types.FETCH_PORTFOLIOS_STATUS_WORKING });
        
        makeApiRequest(dispatch,
            fetchPromise,
            200, 
            data => {
                return { type: types.FETCH_PORTFOLIOS_STATUS_SUCCESSFUL, data: data as PortfoliosStatus };
            }, 
            error => {
                return { type: types.FETCH_PORTFOLIOS_STATUS_FAILED, errorMessage: error };
            });
    };
}

export function getPortfoliosTimeline(){
    return (dispatch: Dispatch<any>) => {
        let fetchPromise = ApiService.getAllPortfolioTimeline();
        dispatch({ type: types.FETCH_PORTFOLIOS_TIMELINE_WORKING });
        
        makeApiRequest(dispatch,
            fetchPromise,
            200, 
            data => {
                return { type: types.FETCH_PORTFOLIOS_TIMELINE_SUCCESSFUL, data: data as PortfoliosTimeline };
            }, 
            error => {
                return { type: types.FETCH_PORTFOLIOS_TIMELINE_FAILED, errorMessage: error };
            });
    };
}