import { CompanySearchState } from './companySearchReducer';
import { AccountCreationState } from './createAccountReducer';
import { CreationStageState } from './creationStageReducer';

export interface CreateAccountState {
    stage: CreationStageState;
    
    company: CompanySearchState;
    account: AccountCreationState;
}