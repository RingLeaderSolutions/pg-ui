import * as types from '../../../actions/actionTypes';
import { reduceReducers} from '../../common';
import { AccountCreationStage } from '../../../model/app/AccountCreationStage';

export interface CreationStageState {
    stage: AccountCreationStage;
}

// This reducer is responsible for maintaining some composite request based state
// based on the progression through the account creation screen.
const creationStageReducer = (state: CreationStageState, action: any) => {
    switch(action.type){
        case types.SELECT_METHOD_COMPANY_SEARCH:
            return {
                ...state,
                stage: AccountCreationStage.CompanySearch
            };

        case types.SELECT_METHOD_MANUAL:
            return {
                ...state,
                stage: AccountCreationStage.EnterDetail
            };

        case types.COMPANY_SEARCH_SELECTED:
          return {
              ...state,
              stage: AccountCreationStage.EnterDetail
          };
        
        case types.CREATE_ACCOUNT_WORKING:
            return {
                ...state,
                stage: AccountCreationStage.Creation
            };

        case types.CREATE_ACCOUNT_SUCCESSFUL:
          return {
              ...state,
              stage: AccountCreationStage.Complete
          };

        case types.CREATE_ACCOUNT_CLEAR:
          return {
              ...state,
              stage: AccountCreationStage.SelectMethod
          };
        default:
          return state;
      }
}

export default reduceReducers(
    (state: CreationStageState = {
        stage: AccountCreationStage.SelectMethod
    }) => state, 
    creationStageReducer);