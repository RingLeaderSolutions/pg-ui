import ApiService from "../services/apiService";
import { Portfolio,
         PortfolioHistoryEntry,
         CompanyInfo,
         PortfolioDetails,
         UtilityType,
         UploadResponse,
         Account,
         UploadReportsResponse,
         User} from "../model/Models";

import * as types from "./actionTypes";
import { makeApiRequest } from "./common";

import { Dispatch } from 'redux';
import { AccountCompanyStatusFlags } from "../model/HierarchyObjects";
import { Tariff } from "../model/Tender";
import { PortfolioCreationRequest } from "../model/Portfolio";

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
                const details = data as PortfolioDetails;
        
                dispatch({ type: types.RETRIEVE_ACCOUNT_WORKING });

                makeApiRequest(dispatch, 
                    ApiService.retrieveAccount(details.portfolio.accountId),
                    200,
                    data => {
                        return { type: types.RETRIEVE_ACCOUNT_SUCCESSFUL, data: data as Account };
                    },
                    error => {
                        return { type: types.RETRIEVE_ACCOUNT_FAILED, errorMessage: error };
                    });

                return { type: types.FETCH_PORTFOLIO_DETAILS_SUCCESSFUL, data: data };
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
                let portfolio = portfolios.find(p => p.id === portfolioId);
                if(!portfolio){
                    return { type: types.FETCH_SINGLE_PORTFOLIO_FAILED, errorMessage: `Unable to find portfolio with id [${portfolioId}]` };                
                }

                
                
                return { type: types.FETCH_SINGLE_PORTFOLIO_SUCCESSFUL, data: portfolio };
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


export function retrieveAccount(accountId: string){
    return (dispatch: Dispatch<any>) => {
        let retrieveAccount = ApiService.retrieveAccount(accountId);
        dispatch( { type: types.RETRIEVE_ACCOUNT_WORKING });

        makeApiRequest(dispatch,
            retrieveAccount,
            200, 
            data => {
                return { type: types.RETRIEVE_ACCOUNT_SUCCESSFUL, data: data as Account };
                
            }, 
            error => {
                return { type: types.RETRIEVE_ACCOUNT_FAILED, errorMessage: error };
            });
    };
}

export function createAccountFromCompany(company: CompanyInfo){
    return (dispatch: Dispatch<any>) => {
        let createPromise = ApiService.createAccountFromCompany(company);
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

export function createPortfolio(portfolio: PortfolioCreationRequest){
    return (dispatch: Dispatch<any>) => {
        let createPromise = ApiService.createPortfolio(portfolio);
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

export function uploadSupplyMeterData(accountId: string, file: Blob, utility: UtilityType){
    return (dispatch: Dispatch<any>) => {
        let uploadPromise = ApiService.uploadSupplyMeterData(accountId, file, utility);
        dispatch({ type: types.UPLOAD_SUPPLY_METER_DATA_WORKING });

        makeApiRequest(dispatch,
            uploadPromise,
            200, 
            data => {
                var uploadResponse = data as UploadResponse;
                ApiService.reportSuccessfulSupplyMeterDataUpload(accountId, uploadResponse.uploadedFiles, utility);
                return { type: types.UPLOAD_SUPPLY_METER_DATA_SUCCESSFUL, data: null};
                
            }, 
            error => {
                return { type: types.UPLOAD_SUPPLY_METER_DATA_FAILED, errorMessage: error };
            });
    };
}

export function uploadHistoric(portfolioId: string, files: Blob[], historicalType: string){
    return (dispatch: Dispatch<any>) => {
        let uploadPromise = ApiService.uploadHistorical(portfolioId, files);
        dispatch({ type: types.UPLOAD_HISTORICAL_WORKING });

        makeApiRequest(dispatch,
            uploadPromise,
            200, 
            data => {
                var uploadResponse = data as UploadResponse;
                ApiService.reportSuccessfulHistoricalUpload(portfolioId, uploadResponse.uploadedFiles, historicalType);
                return { type: types.UPLOAD_HISTORICAL_SUCCESSFUL, data: null};
                
            }, 
            error => {
                return { type: types.UPLOAD_HISTORICAL_FAILED, errorMessage: error };
            });
    };
}

export function fetchTariffs(){
    return (dispatch: Dispatch<any>) => {
        let fetchTariffsPromise = ApiService.getTariffs();
        dispatch({ type: types.FETCH_TARIFFS_WORKING });

        makeApiRequest(dispatch,
            fetchTariffsPromise,
            200, 
            data => {
                return { type: types.FETCH_TARIFFS_SUCCESSFUL, data: data as Tariff[]};
                
            }, 
            error => {
                return { type: types.FETCH_TARIFFS_FAILED, errorMessage: error };
            });
    };
}

export function fetchPortfolioUploads(portfolioId: string){
    return (dispatch: Dispatch<any>) => {
        let fetchTariffsPromise = ApiService.fetchPortfolioUploads(portfolioId);
        dispatch({ type: types.FETCH_PORTFOLIO_UPLOADS_WORKING });

        makeApiRequest(dispatch,
            fetchTariffsPromise,
            200, 
            data => {
                return { type: types.FETCH_PORTFOLIO_UPLOADS_SUCCESSFUL, data: data as UploadReportsResponse};
                
            }, 
            error => {
                return { type: types.FETCH_PORTFOLIO_UPLOADS_FAILED, errorMessage: error };
            });
    };
}

export function fetchUploadReport(reportId: string){
    return (dispatch: Dispatch<any>) => {
        let fetchTariffsPromise = ApiService.fetchUploadReport(reportId);
        dispatch({ type: types.FETCH_UPLOAD_REPORT_WORKING });

        makeApiRequest(dispatch,
            fetchTariffsPromise,
            200, 
            data => {
                console.log(data);
                return { type: types.FETCH_UPLOAD_REPORT_SUCCESSFUL, data};
                
            }, 
            error => {
                return { type: types.FETCH_UPLOAD_REPORT_FAILED, errorMessage: error };
            });
    };
}

export function fetchUsers(){
    return (dispatch: Dispatch<any>) => {
        let fetchTariffsPromise = ApiService.fetchUsers();
        dispatch({ type: types.FETCH_USERS_WORKING });

        makeApiRequest(dispatch,
            fetchTariffsPromise,
            200, 
            data => {
                return { type: types.FETCH_USERS_SUCCESSFUL, data: data as User[]};
                
            }, 
            error => {
                return { type: types.FETCH_USERS_FAILED, errorMessage: error };
            });
    };
}

export function deletePortfolio(portfolioId: string){
    return (dispatch: Dispatch<any>) => {
        let createPromise = ApiService.deletePortfolio(portfolioId);
        dispatch( { type: types.DELETE_PORTFOLIO_WORKING });

        makeApiRequest(dispatch,
            createPromise,
            200, 
            data => {
                return { type: types.DELETE_PORTFOLIO_SUCCESSFUL, data: data as PortfolioDetails};
                
            }, 
            error => {
                return { type: types.DELETE_PORTFOLIO_FAILED, errorMessage: error };
            });
    };
}

export function editPortfolio(portfolio: PortfolioCreationRequest){
    return (dispatch: Dispatch<any>) => {
        let createPromise = ApiService.editPortfolio(portfolio);
        dispatch( { type: types.EDIT_PORTFOLIO_WORKING });

        makeApiRequest(dispatch,
            createPromise,
            200, 
            data => {
                return { type: types.EDIT_PORTFOLIO_SUCCESSFUL, data: data as PortfolioDetails};
                
            }, 
            error => {
                return { type: types.EDIT_PORTFOLIO_FAILED, errorMessage: error };
            });
    };
}

export function deselectPortfolio(){
    return (dispatch: Dispatch<any>) => {    
        dispatch({ type: types.DESELECT_PORTFOLIO });
    };
}