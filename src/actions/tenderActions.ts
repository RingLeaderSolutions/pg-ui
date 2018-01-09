import ApiService from "../services/ApiService";

import { Tender, TenderContract, TenderSupplier } from "../Model/Tender";

import * as types from "./actionTypes";
import { Dispatch } from 'redux';

import { makeApiRequest } from "./Common";


export function getPortfolioTenders(portfolioId: string){    
    return (dispatch: Dispatch<any>) => {
        let fetchPromise = ApiService.getPortfolioTenders(portfolioId);
        dispatch( { type: types.FETCH_PORTFOLIO_TENDERS_WORKING });

        makeApiRequest(dispatch,
            fetchPromise,
            200, 
            data => {
                return { type: types.FETCH_PORTFOLIO_TENDERS_SUCCESSFUL, data: data as Tender[] };
            }, 
            error => {
                return { type: types.FETCH_PORTFOLIO_TENDERS_FAILED, errorMessage: error };
            });
    }
};

export function getTenderSuppliers(){    
    return (dispatch: Dispatch<any>) => {
        let fetchPromise = ApiService.getTenderSuppliers();
        dispatch( { type: types.FETCH_TENDER_SUPPLIERS_WORKING });

        makeApiRequest(dispatch,
            fetchPromise,
            200, 
            data => {
                return { type: types.FETCH_TENDER_SUPPLIERS_SUCCESSFUL, data: data as TenderSupplier[] };
            }, 
            error => {
                return { type: types.FETCH_TENDER_SUPPLIERS_FAILED, errorMessage: error };
            });
    }
};


export function addExistingContract(portfolioId: string, tenderId: string, contract: TenderContract){
    return (dispatch: Dispatch<any>) => {
        let createPromise = ApiService.addExistingContract(contract, portfolioId, tenderId);
        dispatch({ type: types.TENDER_ADD_EXISTING_CONTRACT_WORKING });

        makeApiRequest(dispatch,
            createPromise,
            200, 
            data => {
                return { type: types.TENDER_ADD_EXISTING_CONTRACT_SUCCESSFUL, data: null};
                
            }, 
            error => {
                return { type: types.TENDER_ADD_EXISTING_CONTRACT_FAILED, errorMessage: error };
            });
    };
}