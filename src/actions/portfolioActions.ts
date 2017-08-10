import ApiService from "../services/ApiService";
import { Portfolio } from "../Model/Models";

import * as types from "./actionTypes";
import { makeApiRequest } from "./Common";

import { Dispatch } from 'redux';

function fetching() {
    return { type: types.FETCH_PORTFOLIO_WORKING };
}

function fetchFailed(errorMessage : string) {
    console.log(`fetchFailed: Failed to fetch portfolio`);
    return { type: types.FETCH_PORTFOLIO_FAILED, errorMessage };
}

function fetchSuccessful(portfolio: Portfolio[]) {
    console.log(`fetchSuccessful: Received [${portfolio.length}] portfolios.`);
    return { type: types.FETCH_PORTFOLIO_SUCCESSFUL, portfolio };
}

export function getAllPortfolios(){
    return (dispatch: Dispatch<any>) => {
        let fetchPromise = ApiService.getAllPortfolios();
        dispatch(fetching());
        makeApiRequest(dispatch, fetchPromise, 200, data => fetchSuccessful(data as Portfolio[]), error => fetchFailed(error));
    };
}