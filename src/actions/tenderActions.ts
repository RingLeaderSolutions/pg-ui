import ApiService from "../services/ApiService";

import { Tender, TenderContract, TenderSupplier, BackingSheet, TenderIssuanceEmail, QuoteExportResponse, TenderRequirements } from "../Model/Tender";
import { UploadResponse, UtilityType } from "../model/Models";

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

export function updateTenderSuppliers(tenderId: string, supplierIds: string[]){
    return (dispatch: Dispatch<any>) => {
        let createPromise = ApiService.updateTenderSuppliers(tenderId, supplierIds);
        dispatch({ type: types.UPDATE_TENDER_SUPPLIERS_WORKING });

        makeApiRequest(dispatch,
            createPromise,
            200, 
            data => {
                return { type: types.UPDATE_TENDER_SUPPLIERS_SUCCESSFUL, data: null};
                
            }, 
            error => {
                return { type: types.UPDATE_TENDER_SUPPLIERS_FAILED, errorMessage: error };
            });
    };
}

export function uploadGasBackingSheet(contractId: string, file: Blob){
    return (dispatch: Dispatch<any>) => {
        let uploadPromise = ApiService.uploadGasBackingSheet(contractId, file);
        dispatch({ type: types.UPLOAD_GAS_BACKING_SHEET_WORKING });

        makeApiRequest(dispatch,
            uploadPromise,
            200, 
            data => {
                var uploadResponse = data as UploadResponse;
                ApiService.reportSuccessfulBackingSheetUpload(contractId, uploadResponse.uploadedFiles, UtilityType.Gas);
                return { type: types.UPLOAD_GAS_BACKING_SHEET_SUCCESSFUL, data: null};
                
            }, 
            error => {
                return { type: types.UPLOAD_GAS_BACKING_SHEET_FAILED, errorMessage: error };
            });
    };
}

export function uploadElectricityBackingSheet(contractId: string, file: Blob){
    return (dispatch: Dispatch<any>) => {
        let uploadPromise = ApiService.uploadElectricityBackingSheet(contractId, file);
        dispatch({ type: types.UPLOAD_ELECTRICITY_BACKING_SHEET_WORKING });

        makeApiRequest(dispatch,
            uploadPromise,
            200, 
            data => {
                var uploadResponse = data as UploadResponse;
                ApiService.reportSuccessfulBackingSheetUpload(contractId, uploadResponse.uploadedFiles, UtilityType.Electricity);
                return { type: types.UPLOAD_ELECTRICITY_BACKING_SHEET_SUCCESSFUL, data: null};
            }, 
            error => {
                return { type: types.UPLOAD_ELECTRICITY_BACKING_SHEET_FAILED, errorMessage: error };
            });
    };
}

export function updateTender(tenderId: string, tender: Tender){
    return (dispatch: Dispatch<any>) => {
        let updateTenderPromise = ApiService.updateTender(tenderId, tender);
        dispatch({ type: types.UPDATE_TENDER_WORKING });

        makeApiRequest(dispatch,
            updateTenderPromise,
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
        let generatePromise = ApiService.generateTenderPack(tenderId, portfolioId);
        dispatch({ type: types.GENERATE_TENDER_PACK_WORKING });

        makeApiRequest(dispatch,
            generatePromise,
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

export function fetchTenderIssuanceEmail(tenderId: string){    
    return (dispatch: Dispatch<any>) => {
        let fetchPromise = ApiService.fetchTenderIssuanceEmail(tenderId);
        dispatch( { type: types.FETCH_TENDER_ISSUANCE_EMAIL_WORKING });

        makeApiRequest(dispatch,
            fetchPromise,
            200, 
            data => {
                return { type: types.FETCH_TENDER_ISSUANCE_EMAIL_SUCCESSFUL, data: data as TenderIssuanceEmail };
            }, 
            error => {
                return { type: types.FETCH_TENDER_ISSUANCE_EMAIL_FAILED, errorMessage: error };
            });
    }
};

export function exportContractRates(tenderId: string, quoteId: string){    
    return (dispatch: Dispatch<any>) => {
        let fetchPromise = ApiService.exportContractRates(tenderId, quoteId);
        dispatch( { type: types.EXPORT_CONTRACT_RATES_WORKING });

        makeApiRequest(dispatch,
            fetchPromise,
            200, 
            data => {
                var resp = data as QuoteExportResponse;
                window.open(resp.exportUri, '_blank');
                return { type: types.EXPORT_CONTRACT_RATES_SUCCESSFUL, data: data};
            }, 
            error => {
                return { type: types.EXPORT_CONTRACT_RATES_FAILED, errorMessage: error };
            });
    }
};

export function uploadGasOffer(tenderId: string, supplierId: string, useGeneric: boolean, file: Blob){
    return (dispatch: Dispatch<any>) => {
        let uploadPromise = ApiService.uploadOffer(tenderId, supplierId, file);
        dispatch({ type: types.UPLOAD_GAS_OFFER_WORKING });

        makeApiRequest(dispatch,
            uploadPromise,
            200, 
            data => {
                var uploadResponse = data as UploadResponse;
                ApiService.reportSuccessfulOfferUpload(tenderId, supplierId, useGeneric, uploadResponse.uploadedFiles, UtilityType.Gas);
                return { type: types.UPLOAD_GAS_OFFER_SUCCESSFUL, data: null};
            }, 
            error => {
                return { type: types.UPLOAD_GAS_OFFER_FAILED, errorMessage: error };
            });
    };
}

export function uploadElectricityOffer(tenderId: string, supplierId: string, useGeneric: boolean, file: Blob){
    return (dispatch: Dispatch<any>) => {
        let uploadPromise = ApiService.uploadOffer(tenderId, supplierId, file);
        dispatch({ type: types.UPLOAD_ELECTRICITY_OFFER_WORKING });

        makeApiRequest(dispatch,
            uploadPromise,
            200, 
            data => {
                var uploadResponse = data as UploadResponse;
                ApiService.reportSuccessfulOfferUpload(tenderId, supplierId, useGeneric, uploadResponse.uploadedFiles, UtilityType.Electricity);
                return { type: types.UPLOAD_ELECTRICITY_OFFER_SUCCESSFUL, data: null};
            }, 
            error => {
                return { type: types.UPLOAD_ELECTRICITY_OFFER_FAILED, errorMessage: error };
            });
    };
}

export function updateTenderRequirements(requirements: TenderRequirements){    
    return (dispatch: Dispatch<any>) => {
        let fetchPromise = ApiService.updateTenderRequirements(requirements);
        dispatch( { type: types.UPDATE_TENDER_REQUIREMENTS_WORKING });

        makeApiRequest(dispatch,
            fetchPromise,
            200, 
            data => {
                return { type: types.UPDATE_TENDER_REQUIREMENTS_SUCCESSFUL, data: null};
            }, 
            error => {
                return { type: types.UPDATE_TENDER_REQUIREMENTS_FAILED, errorMessage: error };
            });
    }
};

export function deleteQuote(tenderId: string, quoteId: string){
    return (dispatch: Dispatch<any>) => {
        let createPromise = ApiService.deleteQuote(tenderId, quoteId);
        dispatch({ type: types.DELETE_QUOTE_WORKING });

        makeApiRequest(dispatch,
            createPromise,
            200, 
            data => {
                return { type: types.DELETE_QUOTE_SUCCESSFUL, data: null};
                
            }, 
            error => {
                return { type: types.DELETE_QUOTE_FAILED, errorMessage: error };
            });
    };
}