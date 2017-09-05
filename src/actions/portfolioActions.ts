import ApiService from "../services/ApiService";
import { Portfolio, MpanSummary, PortfolioHistoryEntry, Site } from "../Model/Models";

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

export function getSinglePortfolio(portfolioId: string){
    return (dispatch: Dispatch<any>) => {
        let fetchPromise = ApiService.getAllPortfolios();
        dispatch( { type: types.FETCH_SINGLE_PORTFOLIO_WORKING });

        makeApiRequest(dispatch,
            fetchPromise,
            200, 
            data => {
                var portfolios = data as Portfolio[];
                for(var i = 0; i < portfolios.length; i++){
                    var portfolio = portfolios[i];
    
                    if (portfolio.id == portfolioId){
                        return { type: types.FETCH_SINGLE_PORTFOLIO_SUCCESSFUL, data: portfolio};
                    }
                }
                return { type: types.FETCH_SINGLE_PORTFOLIO_FAILED, errorMessage: `Unable to find portfolio with id [${portfolioId}]` };                
            }, 
            error => {
                return { type: types.FETCH_SINGLE_PORTFOLIO_FAILED, errorMessage: error };
            });
    };
}

export function getPortfolioMpanSummary(portfolioId: string){
    return (dispatch: Dispatch<any>) => {
        let fetchPromise = ApiService.getPortfolioMpanSummary(portfolioId);
        dispatch( { type: types.FETCH_PORTFOLIO_MPANSUMMARY_WORKING });

        makeApiRequest(dispatch,
            fetchPromise,
            200, 
            data => {
                return { type: types.FETCH_PORTFOLIO_MPANSUMMARY_SUCCESSFUL, data: data as MpanSummary[]};
                
            }, 
            error => {
                return { type: types.FETCH_PORTFOLIO_MPANSUMMARY_FAILED, errorMessage: error };
            });
    };
}

export function getPortfolioHistory(portfolioId: string){
    return (dispatch: Dispatch<any>) => {
        let fetchPromise = ApiService.getPortfolioHistory(portfolioId);
        dispatch( { type: types.FETCH_PORTFOLIO_HISTORY_WORKING });

        makeApiRequest(dispatch,
            fetchPromise,
            200, 
            data => {
                return { type: types.FETCH_PORTFOLIO_HISTORY_SUCCESSFUL, data: data as PortfolioHistoryEntry[]};
                
            }, 
            error => {
                return { type: types.FETCH_PORTFOLIO_HISTORY_FAILED, errorMessage: error };
            });
    };
}

export function getPortfolioSiteMpans(portfolioId: string){
    return (dispatch: Dispatch<any>) => {
        let fetchPromise = ApiService.getPortfolioSiteMpans(portfolioId);
        dispatch( { type: types.FETCH_PORTFOLIO_SITE_MPANS_WORKING });

        makeApiRequest(dispatch,
            fetchPromise,
            200, 
            data => {
                return { type: types.FETCH_PORTFOLIO_SITE_MPANS_SUCCESSFUL, data: data as Site[]};
                
            }, 
            error => {
                return { type: types.FETCH_PORTFOLIO_SITE_MPANS_FAILED, errorMessage: error };
            });
    };
}