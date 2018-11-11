import * as types from '../../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../../common';
import { CompanyInfo } from '../../../model/Models';
import { RequestState, idleInitialRequestState } from '../../RequestState';
import { IsNullOrEmpty } from '../../../helpers/extensions/ArrayExtensions';

export interface CompanySearchState extends RequestState {
    value: CompanyInfo;
    companySummaryText: string;
}

const searchCompanyReducer = requestResponseReducer(
    types.COMPANY_SEARCH_WORKING,
    types.COMPANY_SEARCH_SUCCESSFUL,
    types.COMPANY_SEARCH_FAILED,
    (state, action) => {
        if(action.data == "" || action.data == null){
            return {
                ...state,
                value: null,
                working: false,
                error: true,
                errorMessage: `No matches were found for "${action.search}"`
            }
        }

        let info = action.data as CompanyInfo;
        let summaryText = buildSummaryText(info);
        return {
            ...state,
            working: false,     
            error: false,       
            value: info,
            companySummaryText: summaryText
        };
    }
);


const buildSummaryText = (info: CompanyInfo) => {
    let summaryText = "";
    
    summaryText = appendText(summaryText, info.companyNumber);
    summaryText = appendText(summaryText, info.companyName);
    summaryText = appendText(summaryText, info.addressLine1);
    summaryText = appendText(summaryText, info.addressLine2);
    summaryText = appendText(summaryText, info.postTown);
    summaryText = appendText(summaryText, info.county);
    summaryText = appendText(summaryText, info.countryOfOrigin);
    summaryText = appendText(summaryText, info.postcode);

    return summaryText;
}

const separator = "\r\n";
const appendText = (base: string, toAppend: string) => {
    if(toAppend && !toAppend.IsWhitespace()){
        base += toAppend + separator;
    }

    return base;
}


const clearCompanyReducer = (state: CompanySearchState, action: any) => {
    switch(action.type){
        case types.CREATE_ACCOUNT_CLEAR:
        case types.COMPANY_SEARCH_CLEAR:
          return {
              ...state,
              value: null
          }
        default:
          return state;
      }
}

export default reduceReducers((state = idleInitialRequestState) => state, searchCompanyReducer, clearCompanyReducer);