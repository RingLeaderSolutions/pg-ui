import { AccountsState } from './retrieveAccountsReducer';
import { AccountDetailState } from './retrieveAccountDetailReducer';
import { AccountDocumentationState } from './fetchAccountDocumentationReducer';
import { AccountUploadsState } from './fetchAccountUploadsReducer';
import { CreateAccountState } from './createAccount/CreateAccountState';
import { RequestState } from '../RequestState';
import { AccountContractsState } from './fetchAccountContractsReducer';
import { RenewContractState } from './renewContractReducer';

export interface HierarchyState {
    accounts: AccountsState;
    selected: AccountDetailState;
    selected_documentation: AccountDocumentationState;
    selected_uploads: AccountUploadsState;
    create_account: CreateAccountState;
    selected_portfolios: RequestState;
    selected_contracts: AccountContractsState;
    renew_contract: RenewContractState;
}