import * as types from '../../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../../common';
import { PortfolioDetails } from '../../../model/Models';
import { RequestState, idleInitialRequestState } from '../../RequestState';

export interface PortfolioCreationState extends RequestState {
    value: PortfolioDetails;
}

const createPortfolioReducer = requestResponseReducer(
    types.CREATE_PORTFOLIO_WORKING,
    types.CREATE_PORTFOLIO_SUCCESSFUL,
    types.CREATE_PORTFOLIO_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,     
            error: false,       
            value: action.data.id
        };
    }
);

const clearCreationReducer = (state: PortfolioCreationState, action: any) => {
    switch(action.type){
        case types.CLEAR_PORTFOLIO_CREATION:
          return {
              ...state,
              value: null
          }
        default:
          return state;
      }
};

export default reduceReducers((state = idleInitialRequestState) => state, createPortfolioReducer, clearCreationReducer);