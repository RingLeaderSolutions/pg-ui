import * as types from '../../../actions/actionTypes';
import { reduceReducers} from '../../common';
import { PortfolioCreationStage } from '../../../model/Models';

export interface CreationStageState {
    stage: PortfolioCreationStage;
}

// This reducer is responsible for maintaining some composite request based state
// based on the progression through the portfolio creation screen.
// e.g. User searches for company -> Selects company (agrees to create) 
//      -> Account is created -> Portfolio is created
const creationStageReducer = (state: CreationStageState, action: any) => {
    switch(action.type){
        case types.COMPANY_SEARCH_SELECTED:
          return {
              ...state,
              stage: PortfolioCreationStage.AccountCreation
          };
        case types.CREATE_ACCOUNT_SUCCESSFUL:
          return {
              ...state,
              stage: PortfolioCreationStage.PortfolioCreation
          };
        case types.CREATE_PORTFOLIO_SUCCESSFUL:
          return {
              ...state,
              stage: PortfolioCreationStage.Complete
          };
        case types.CLEAR_PORTFOLIO_CREATION:
          return {
              ...state,
              stage: PortfolioCreationStage.CompanySearch
          };
        default:
          return state;
      }
}

export default reduceReducers(
    (state: CreationStageState = {
        stage: PortfolioCreationStage.CompanySearch
    }) => state, 
    creationStageReducer);