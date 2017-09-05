import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { Site } from '../../model/Models';
import { RequestState, initialRequestState } from '../RequestState';

export interface PortfolioSiteMpansState extends RequestState {
    value: Site[];
}

const portfolioSiteMpansReducer = requestResponseReducer(
    types.FETCH_PORTFOLIO_SITE_MPANS_WORKING,
    types.FETCH_PORTFOLIO_SITE_MPANS_SUCCESSFUL,
    types.FETCH_PORTFOLIO_SITE_MPANS_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,     
            error: false,       
            value: action.data
        };
    }
);

export default reduceReducers((state = initialRequestState) => state, portfolioSiteMpansReducer);