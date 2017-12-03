import { CompanySearchState } from './companySearchReducer';
import { AccountCreationState } from './createAccountReducer';
import { PortfolioCreationState } from './createPortfolioReducer';
import { CreationStageState } from './creationStageReducer';

export interface CreatePortfolioState {
    stage: CreationStageState;
    
    company: CompanySearchState;
    account: AccountCreationState;
    portfolio: PortfolioCreationState;
}