import ApiService from "../services/ApiService";
import { Portfolio,
         PortfolioHistoryEntry,
         Site,  
         MpanTopline,
         MpanHistorical,
         CompanyInfo,
         PortfolioDetails,
         PortfolioContact, 
         UtilityType} from "../Model/Models";

import * as types from "./actionTypes";
import { makeApiRequest } from "./Common";

import { Dispatch } from 'redux';
import { PortfolioRequirements } from "../model/PortfolioDetails";
import { AccountCompanyStatusFlags } from "../model/Account";

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

export function retrieveAccount(accountId: string){
    return (dispatch: Dispatch<any>) => {
        let updatePromise = ApiService.retrieveAccount(accountId);
        dispatch( { type: types.RETRIEVE_ACCOUNT_WORKING });

        makeApiRequest(dispatch,
            updatePromise,
            200, 
            data => {
                return { type: types.RETRIEVE_ACCOUNT_SUCCESSFUL, data: data as Account };
                
            }, 
            error => {
                return { type: types.RETRIEVE_ACCOUNT_FAILED, errorMessage: error };
            });
    };
}

export function createAccount(company: CompanyInfo){
    return (dispatch: Dispatch<any>) => {
        let createPromise = ApiService.createAccount(company);
        dispatch( { type: types.CREATE_ACCOUNT_WORKING });

        makeApiRequest(dispatch,
            createPromise,
            201, 
            data => {
                return { type: types.CREATE_ACCOUNT_SUCCESSFUL, data};
                
            }, 
            error => {
                return { type: types.CREATE_ACCOUNT_FAILED, errorMessage: error };
            });
    };
}

export function updateCompanyStatus(accountId: string, statusFlags: AccountCompanyStatusFlags){
    return (dispatch: Dispatch<any>) => {
        let updatePromise = ApiService.updateAccountFlags(accountId, statusFlags);
        dispatch( { type: types.UPDATE_COMPANY_STATUS_WORKING });

        makeApiRequest(dispatch,
            updatePromise,
            200, 
            data => {
                return { type: types.UPDATE_COMPANY_STATUS_SUCCESSFUL, data: data as Account };
                
            }, 
            error => {
                return { type: types.UPDATE_COMPANY_STATUS_FAILED, errorMessage: error };
            });
    };
}

export function createPortfolio(accountId: string, company: CompanyInfo){
    return (dispatch: Dispatch<any>) => {
        let createPromise = ApiService.createPortfolio(accountId, company);
        dispatch( { type: types.CREATE_PORTFOLIO_WORKING });

        makeApiRequest(dispatch,
            createPromise,
            200, 
            data => {
                return { type: types.CREATE_PORTFOLIO_SUCCESSFUL, data: data as PortfolioDetails};
                
            }, 
            error => {
                return { type: types.CREATE_PORTFOLIO_FAILED, errorMessage: error };
            });
    };
}

export function clearPortfolioCreation(){
    return (dispatch: Dispatch<any>) => {
        dispatch( { type: types.CLEAR_PORTFOLIO_CREATION });
    };
}

export function createPortfolioContact(contact: PortfolioContact){
    return (dispatch: Dispatch<any>) => {
        let createPromise = ApiService.updatePortfolioContact(contact);
        dispatch({ type: types.CREATE_PORTFOLIO_CONTACT_WORKING });

        makeApiRequest(dispatch,
            createPromise,
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
        let updatePromise = ApiService.updatePortfolioRequirements(requirements);
        dispatch({ type: types.UPDATE_PORTFOLIO_REQUIREMENTS_WORKING });

        makeApiRequest(dispatch,
            updatePromise,
            200, 
            data => {
                return { type: types.UPDATE_PORTFOLIO_REQUIREMENTS_SUCCESSFUL, data: null};
                
            }, 
            error => {
                return { type: types.UPDATE_PORTFOLIO_REQUIREMENTS_FAILED, errorMessage: error };
            });
    };
}

export function uploadLetterOfAuthority(portfolioId: string, accountId: string, file: Blob){
    return (dispatch: Dispatch<any>) => {
        let uploadPromise = ApiService.uploadLoa(portfolioId, accountId, file);
        dispatch({ type: types.UPLOAD_LOA_WORKING });

        makeApiRequest(dispatch,
            uploadPromise,
            200, 
            data => {
                return { type: types.UPLOAD_LOA_SUCCESSFUL, data: null};
                
            }, 
            error => {
                return { type: types.UPLOAD_LOA_FAILED, errorMessage: error };
            });
    };
}

export function uploadSiteList(portfolioId: string, accountId: string, file: Blob){
    return (dispatch: Dispatch<any>) => {
        let uploadPromise = ApiService.uploadSiteList(portfolioId, accountId, file);
        dispatch({ type: types.UPLOAD_SITELIST_WORKING });

        makeApiRequest(dispatch,
            uploadPromise,
            200, 
            data => {
                return { type: types.UPLOAD_SITELIST_SUCCESSFUL, data: null};
                
            }, 
            error => {
                return { type: types.UPLOAD_SITELIST_FAILED, errorMessage: error };
            });
    };
}

export function uploadSupplyMeterData(portfolioId: string, accountId: string, file: Blob, utility: UtilityType){
    return (dispatch: Dispatch<any>) => {
        let uploadPromise = ApiService.uploadSupplyMeterData(portfolioId, accountId, file, utility);
        dispatch({ type: types.UPLOAD_SUPPLY_METER_DATA_WORKING });

        makeApiRequest(dispatch,
            uploadPromise,
            200, 
            data => {
                return { type: types.UPLOAD_SUPPLY_METER_DATA_SUCCESSFUL, data: null};
                
            }, 
            error => {
                return { type: types.UPLOAD_SUPPLY_METER_DATA_FAILED, errorMessage: error };
            });
    };
}

export function uploadHistoric(portfolioId: string, file: Blob){
    return (dispatch: Dispatch<any>) => {
        let uploadPromise = ApiService.uploadHistorical(portfolioId, file);
        dispatch({ type: types.UPLOAD_HISTORICAL_WORKING });

        makeApiRequest(dispatch,
            uploadPromise,
            200, 
            data => {
                return { type: types.UPLOAD_HISTORICAL_SUCCESSFUL, data: null};
                
            }, 
            error => {
                return { type: types.UPLOAD_HISTORICAL_FAILED, errorMessage: error };
            });
    };
}