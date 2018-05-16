import * as types from '../../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../../common';
import { CompanyInfo } from '../../../model/Models';
import { RequestState, idleInitialRequestState } from '../../RequestState';

export interface CompanySearchState extends RequestState {
    value: CompanyInfo;
}

const searchCompanyReducer = requestResponseReducer(
    types.COMPANY_SEARCH_WORKING,
    types.COMPANY_SEARCH_SUCCESSFUL,
    types.COMPANY_SEARCH_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,     
            error: false,       
            value: action.data
        };
    }
);

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