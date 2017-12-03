import * as types from '../../../actions/actionTypes';
import { reduceReducers} from '../../common';
import { PortfolioCreationStage } from '../../../model/Models';

export interface CreationStageState {
    stage: PortfolioCreationStage;
}

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
        default:
          return state;
      }
}

export default reduceReducers(
    (state: CreationStageState = {
        stage: PortfolioCreationStage.CompanySearch
    }) => state, 
    creationStageReducer);