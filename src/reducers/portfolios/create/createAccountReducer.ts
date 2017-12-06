import * as types from '../../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../../common';
import { RequestState, idleInitialRequestState } from '../../RequestState';

export interface AccountCreationState extends RequestState {
    value: string;
}

const createAccountReducer = requestResponseReducer(
    types.CREATE_ACCOUNT_WORKING,
    types.CREATE_ACCOUNT_SUCCESSFUL,
    types.CREATE_ACCOUNT_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,     
            error: false,       
            value: action.data.id
        };
    }
);

const clearCreationReducer = (state: AccountCreationState, action: any) => {
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

export default reduceReducers((state = idleInitialRequestState) => state, createAccountReducer, clearCreationReducer);