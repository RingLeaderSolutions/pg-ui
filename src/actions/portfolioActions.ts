import ApiService from "../services/ApiService";
import { Portfolio,
         MpanSummary,
         PortfolioHistoryEntry,
         Site,  
         MpanTopline,
         MpanHistorical,
         CompanyInfo,
         PortfolioDetails,
         PortfolioContact } from "../Model/Models";

import * as types from "./actionTypes";
import { makeApiRequest } from "./Common";

import { Dispatch } from 'redux';
import { PortfolioRequirements } from "../model/PortfolioDetails";

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

export function getPortfolioDetails(portfolioId: string){
    return (dispatch: Dispatch<any>) => {
        let fetchPromise = ApiService.getPortfolioDetails(portfolioId);
        dispatch( { type: types.FETCH_PORTFOLIO_DETAILS_WORKING });

        makeApiRequest(dispatch,
            fetchPromise,
            200, 
            data => {
                return { type: types.FETCH_PORTFOLIO_DETAILS_SUCCESSFUL, data: data as PortfolioDetails };
            }, 
            error => {
                return { type: types.FETCH_PORTFOLIO_DETAILS_FAILED, errorMessage: error };
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

        makeApiRequest<{sites:Site[]}>(dispatch,
            fetchPromise,
            200, 
            data => {
                return { type: types.FETCH_PORTFOLIO_SITE_MPANS_SUCCESSFUL, data: data.sites as Site[]};
                
            }, 
            error => {
                return { type: types.FETCH_PORTFOLIO_SITE_MPANS_FAILED, errorMessage: error };
            });
    };
}

// TODO: Move topline & historical calls to own Actions
export function getMpanTopline(documentId: string){
    return (dispatch: Dispatch<any>) => {
        let fetchPromise = ApiService.getMpanTopline(documentId);
        dispatch( { type: types.FETCH_MPAN_TOPLINE_WORKING });

        makeApiRequest(dispatch,
            fetchPromise,
            200, 
            data => {
                return { type: types.FETCH_MPAN_TOPLINE_SUCCESSFUL, data: data as MpanTopline};
                
            }, 
            error => {
                return { type: types.FETCH_MPAN_TOPLINE_FAILED, errorMessage: error };
            });
    };
}

export function getMpanHistorical(documentId: string){
    return (dispatch: Dispatch<any>) => {
        let fetchPromise = ApiService.getMpanHistorical(documentId);
        dispatch( { type: types.FETCH_MPAN_HISTORICAL_WORKING });

        makeApiRequest(dispatch,
            fetchPromise,
            200, 
            data => {
                return { type: types.FETCH_MPAN_HISTORICAL_SUCCESSFUL, data: data as MpanHistorical};
                
            }, 
            error => {
                return { type: types.FETCH_MPAN_HISTORICAL_FAILED, errorMessage: error };
            });
    };
}

export function searchCompany(registrationNumber: string){
    return (dispatch: Dispatch<any>) => {
        let searchPromise = ApiService.searchCompany(registrationNumber);
        dispatch( { type: types.COMPANY_SEARCH_WORKING });

        makeApiRequest(dispatch,
            searchPromise,
            200, 
            data => {
                return { type: types.COMPANY_SEARCH_SUCCESSFUL, data: data as CompanyInfo};
                
            }, 
            error => {
                return { type: types.COMPANY_SEARCH_FAILED, errorMessage: error };
            });
    };
}

export function clearCompany(){
    return (dispatch: Dispatch<any>) => {
        dispatch( { type: types.COMPANY_SEARCH_CLEAR });
    };
}

export function selectCompany(){
    return (dispatch: Dispatch<any>) => {
        dispatch( { type: types.COMPANY_SEARCH_SELECTED });
    };
}

export function createAccount(company: CompanyInfo){
    return (dispatch: Dispatch<any>) => {
        let searchPromise = ApiService.createAccount(company);
        dispatch( { type: types.CREATE_ACCOUNT_WORKING });

        makeApiRequest(dispatch,
            searchPromise,
            201, 
            data => {
                return { type: types.CREATE_ACCOUNT_SUCCESSFUL, data};
                
            }, 
            error => {
                return { type: types.CREATE_ACCOUNT_FAILED, errorMessage: error };
            });
    };
}

export function createPortfolio(accountId: string, company: CompanyInfo){
    return (dispatch: Dispatch<any>) => {
        let searchPromise = ApiService.createPortfolio(accountId, company);
        dispatch( { type: types.CREATE_PORTFOLIO_WORKING });

        makeApiRequest(dispatch,
            searchPromise,
            200, 
            data => {
                return { type: types.CREATE_PORTFOLIO_SUCCESSFUL, data: data as PortfolioDetails};
                
            }, 
            error => {
                return { type: types.CREATE_PORTFOLIO_FAILED, errorMessage: error };
            });
    };
}

export function createPortfolioContact(contact: PortfolioContact){
    return (dispatch: Dispatch<any>) => {
        let searchPromise = ApiService.updatePortfolioContact(contact);
        dispatch({ type: types.CREATE_PORTFOLIO_CONTACT_WORKING });

        makeApiRequest(dispatch,
            searchPromise,
            200, 
            data => {
                return { type: types.CREATE_PORTFOLIO_CONTACT_SUCCESSFUL, data: null};
                
            }, 
            error => {
                return { type: types.CREATE_PORTFOLIO_CONTACT_FAILED, errorMessage: error };
            });
    };
}

export function updatePortfolioRequirements(requirements: PortfolioRequirements){
    return (dispatch: Dispatch<any>) => {
        let searchPromise = ApiService.updatePortfolioRequirements(requirements);
        dispatch({ type: types.UPDATE_PORTFOLIO_REQUIREMENTS_WORKING });

        makeApiRequest(dispatch,
            searchPromise,
            200, 
            data => {
                return { type: types.UPDATE_PORTFOLIO_REQUIREMENTS_SUCCESSFUL, data: null};
                
            }, 
            error => {
                return { type: types.UPDATE_PORTFOLIO_REQUIREMENTS_FAILED, errorMessage: error };
            });
    };
}