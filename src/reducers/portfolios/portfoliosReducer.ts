import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { Portfolio } from '../../model/Models';
import { PortfoliosState } from './PortfoliosState';
import { initialRequestState } from '../RequestState';

const portfoliosReducer = requestResponseReducer(
    types.FETCH_PORTFOLIOS_WORKING,
    types.FETCH_PORTFOLIOS_SUCCESSFUL,
    types.FETCH_PORTFOLIOS_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,            
            value: action.data
        };
    }
);

export default reduceReducers((state = initialRequestState) => state, portfoliosReducer);