import ApiService from "../services/apiService";
import { DashboardPortfolioSummary, DashboardPortfolioStatus, DashboardPortfolioTimeline } from "../model/Models";

import * as types from "./actionTypes";
import { makeApiRequest } from "./common";

import { Dispatch } from 'redux';

export function getDashboardSummary(){
    return (dispatch: Dispatch<any>) => {
        let fetchPromise = ApiService.getDashboardSummary();
        dispatch({ type: types.FETCH_DASHBOARD_SUMMARY_WORKING });
        
        makeApiRequest(dispatch,
            fetchPromise,
            200, 
            data => {
                return { type: types.FETCH_DASHBOARD_SUMMARY_SUCCESSFUL, data: data as DashboardPortfolioSummary };
            }, 
            error => {
                return { type: types.FETCH_DASHBOARD_SUMMARY_FAILED, errorMessage: error };
            });
    };
}

export function getDashboardStatus(){
    return (dispatch: Dispatch<any>) => {
        let fetchPromise = ApiService.getDashboardStatus();
        dispatch({ type: types.FETCH_DASHBOARD_STATUS_WORKING });
        
        makeApiRequest(dispatch,
            fetchPromise,
            200, 
            data => {
                return { type: types.FETCH_DASHBOARD_STATUS_SUCCESSFUL, data: data as DashboardPortfolioStatus };
            }, 
            error => {
                return { type: types.FETCH_DASHBOARD_STATUS_FAILED, errorMessage: error };
            });
    };
}

export function getDashboardTimeline(){
    return (dispatch: Dispatch<any>) => {
        let fetchPromise = ApiService.getDashboardTimeline();
        dispatch({ type: types.FETCH_DASHBOARD_TIMELINE_WORKING });
        
        makeApiRequest(dispatch,
            fetchPromise,
            200, 
            data => {
                return { type: types.FETCH_DASHBOARD_TIMELINE_SUCCESSFUL, data: data as DashboardPortfolioTimeline };
            }, 
            error => {
                return { type: types.FETCH_DASHBOARD_TIMELINE_FAILED, errorMessage: error };
            });
    };
}