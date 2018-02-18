import ApiService from "../services/ApiService";

import { Tender, TenderContract, TenderSupplier, BackingSheet } from "../Model/Tender";

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

export function deleteTender(portfolioId: string, tenderId: string){
    return (dispatch: Dispatch<any>) => {
        let createPromise = ApiService.deleteTender(portfolioId, tenderId);
        dispatch({ type: types.DELETE_TENDER_WORKING });

        makeApiRequest(dispatch,
            createPromise,
            200, 
            data => {
                return { type: types.DELETE_TENDER_SUCCESSFUL, data: null};
                
            }, 
            error => {
                return { type: types.DELETE_TENDER_FAILED, errorMessage: error };
            });
    };
}

export function createHHElectricityTender(portfolioId: string){
    return (dispatch: Dispatch<any>) => {
        let createPromise = ApiService.createHHElectricityTender(portfolioId);
        dispatch({ type: types.CREATE_HH_ELECTRICITY_TENDER_WORKING });

        makeApiRequest(dispatch,
            createPromise,
            200, 
            data => {
                return { type: types.CREATE_HH_ELECTRICITY_TENDER_SUCCESSFUL, data: null};
                
            }, 
            error => {
                return { type: types.CREATE_HH_ELECTRICITY_TENDER_FAILED, errorMessage: error };
            });
    };
}

export function createNHHElectricityTender(portfolioId: string){
    return (dispatch: Dispatch<any>) => {
        let createPromise = ApiService.createNHHElectricityTender(portfolioId);
        dispatch({ type: types.CREATE_NHH_ELECTRICITY_TENDER_WORKING });

        makeApiRequest(dispatch,
            createPromise,
            200, 
            data => {
                return { type: types.CREATE_NHH_ELECTRICITY_TENDER_SUCCESSFUL, data: null};
                
            }, 
            error => {
                return { type: types.CREATE_NHH_ELECTRICITY_TENDER_FAILED, errorMessage: error };
            });
    };
}

export function createGasTender(portfolioId: string){
    return (dispatch: Dispatch<any>) => {
        let createPromise = ApiService.createGasTender(portfolioId);
        dispatch({ type: types.CREATE_GAS_TENDER_WORKING });

        makeApiRequest(dispatch,
            createPromise,
            200, 
            data => {
                return { type: types.CREATE_GAS_TENDER_SUCCESSFUL, data: null};
                
            }, 
            error => {
                return { type: types.CREATE_GAS_TENDER_FAILED, errorMessage: error };
            });
    };
}

export function assignTenderSupplier(tenderId: string, supplierId: string){
    return (dispatch: Dispatch<any>) => {
        let createPromise = ApiService.assignTenderSupplier(tenderId, supplierId);
        dispatch({ type: types.ASSIGN_TENDER_SUPPLIER_WORKING });

        makeApiRequest(dispatch,
            createPromise,
            200, 
            data => {
                return { type: types.ASSIGN_TENDER_SUPPLIER_SUCCESSFUL, data: null};
                
            }, 
            error => {
                return { type: types.ASSIGN_TENDER_SUPPLIER_FAILED, errorMessage: error };
            });
    };
}

export function unassignTenderSupplier(tenderId: string, supplierId: string){
    return (dispatch: Dispatch<any>) => {
        let createPromise = ApiService.unassignTenderSupplier(tenderId, supplierId);
        dispatch({ type: types.UNASSIGN_TENDER_SUPPLIER_WORKING });

        makeApiRequest(dispatch,
            createPromise,
            200, 
            data => {
                return { type: types.UNASSIGN_TENDER_SUPPLIER_SUCCESSFUL, data: null};
                
            }, 
            error => {
                return { type: types.UNASSIGN_TENDER_SUPPLIER_FAILED, errorMessage: error };
            });
    };
}

export function uploadGasBackingSheet(tenderId: string, file: Blob){
    return (dispatch: Dispatch<any>) => {
        let uploadPromise = ApiService.uploadGasBackingSheet(tenderId, file);
        dispatch({ type: types.UPLOAD_GAS_BACKING_SHEET_WORKING });

        makeApiRequest(dispatch,
            uploadPromise,
            200, 
            data => {
                return { type: types.UPLOAD_GAS_BACKING_SHEET_SUCCESSFUL, data: null};
                
            }, 
            error => {
                return { type: types.UPLOAD_GAS_BACKING_SHEET_FAILED, errorMessage: error };
            });
    };
}

export function uploadElectricityBackingSheet(tenderId: string, file: Blob){
    return (dispatch: Dispatch<any>) => {
        let uploadPromise = ApiService.uploadElectricityBackingSheet(tenderId, file);
        dispatch({ type: types.UPLOAD_ELECTRICITY_BACKING_SHEET_WORKING });

        makeApiRequest(dispatch,
            uploadPromise,
            200, 
            data => {
                return { type: types.UPLOAD_ELECTRICITY_BACKING_SHEET_SUCCESSFUL, data: null};
                
            }, 
            error => {
                return { type: types.UPLOAD_ELECTRICITY_BACKING_SHEET_FAILED, errorMessage: error };
            });
    };
}

export function updateTender(tenderId: string, tender: Tender){
    return (dispatch: Dispatch<any>) => {
        let uploadPromise = ApiService.updateTender(tenderId, tender);
        dispatch({ type: types.UPDATE_TENDER_WORKING });

        makeApiRequest(dispatch,
            uploadPromise,
            200, 
            data => {
                return { type: types.UPDATE_TENDER_SUCCESSFUL, data: null};
                
            }, 
            error => {
                return { type: types.UPDATE_TENDER_FAILED, errorMessage: error };
            });
    };
}

export function generateTenderPack(portfolioId: string, tenderId: string){
    return (dispatch: Dispatch<any>) => {
        let uploadPromise = ApiService.generateTenderPack(tenderId, portfolioId);
        dispatch({ type: types.GENERATE_TENDER_PACK_WORKING });

        makeApiRequest(dispatch,
            uploadPromise,
            200, 
            data => {
                return { type: types.GENERATE_TENDER_PACK_SUCCESSFUL, data: null};
                
            }, 
            error => {
                return { type: types.GENERATE_TENDER_PACK_FAILED, errorMessage: error };
            });
    };
}

export function fetchContractBackingSheets(tenderId: string, contractId: string){    
    return (dispatch: Dispatch<any>) => {
        let fetchPromise = ApiService.getContractBackingSheets(tenderId, contractId);
        dispatch( { type: types.FETCH_CONTRACT_BACKINGSHEETS_WORKING });

        makeApiRequest(dispatch,
            fetchPromise,
            200, 
            data => {
                return { type: types.FETCH_CONTRACT_BACKINGSHEETS_SUCCESSFUL, data: data as BackingSheet[] };
            }, 
            error => {
                return { type: types.FETCH_CONTRACT_BACKINGSHEETS_FAILED, errorMessage: error };
            });
    }
};

export function fetchQuoteBackingSheets(tenderId: string, contractId: string){    
    return (dispatch: Dispatch<any>) => {
        let fetchPromise = ApiService.getQuoteBackingSheets(tenderId, contractId);
        dispatch( { type: types.FETCH_QUOTE_BACKINGSHEETS_WORKING });

        makeApiRequest(dispatch,
            fetchPromise,
            200, 
            data => {
                return { type: types.FETCH_QUOTE_BACKINGSHEETS_SUCCESSFUL, data: data as BackingSheet[] };
            }, 
            error => {
                return { type: types.FETCH_QUOTE_BACKINGSHEETS_FAILED, errorMessage: error };
            });
    }
};

export function issueTenderPack(tenderId: string, subject: string, body: string){    
    return (dispatch: Dispatch<any>) => {
        let fetchPromise = ApiService.issueTenderPack(tenderId, subject, body);
        dispatch( { type: types.ISSUE_TENDER_PACK_WORKING });

        makeApiRequest(dispatch,
            fetchPromise,
            200, 
            data => {
                return { type: types.ISSUE_TENDER_PACK_SUCCESSFUL, data: null };
            }, 
            error => {
                return { type: types.ISSUE_TENDER_PACK_FAILED, errorMessage: error };
            });
    }
};

export function generateSummaryReport(tenderId: string, quoteId: string, marketCommentary: string, selectionCommentary: string){    
    return (dispatch: Dispatch<any>) => {
        let fetchPromise = ApiService.generateSummaryReport(tenderId, quoteId, marketCommentary, selectionCommentary);
        dispatch( { type: types.GENERATE_SUMMARY_REPORT_WORKING });

        makeApiRequest(dispatch,
            fetchPromise,
            200, 
            data => {
                return { type: types.GENERATE_SUMMARY_REPORT_SUCCESSFUL, data: null };
            }, 
            error => {
                return { type: types.GENERATE_SUMMARY_REPORT_FAILED, errorMessage: error };
            });
    }
};

export function issueSummaryReport(tenderId: string, reportId: string){    
    return (dispatch: Dispatch<any>) => {
        let fetchPromise = ApiService.issueSummaryReport(tenderId, reportId);
        dispatch( { type: types.ISSUE_SUMMARY_REPORT_WORKING });

        makeApiRequest(dispatch,
            fetchPromise,
            200, 
            data => {
                return { type: types.ISSUE_SUMMARY_REPORT_SUCCESSFUL, data: null };
            }, 
            error => {
                return { type: types.ISSUE_SUMMARY_REPORT_FAILED, errorMessage: error };
            });
    }
};