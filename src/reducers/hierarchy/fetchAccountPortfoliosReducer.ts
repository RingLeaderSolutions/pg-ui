import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { UploadReportsResponse } from '../../model/Models';
import { RequestState, initialRequestState } from '../RequestState';

const accountPortfoliosReducer = requestResponseReducer(
    types.FETCH_ACCOUNT_PORTFOLIOS_WORKING,
    types.FETCH_ACCOUNT_PORTFOLIOS_SUCCESSFUL,
    types.FETCH_ACCOUNT_PORTFOLIOS_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,         
            error: false,   
            value: action.data
        };
    }
);

export default reduceReducers((state = initialRequestState) => state, accountPortfoliosReducer);