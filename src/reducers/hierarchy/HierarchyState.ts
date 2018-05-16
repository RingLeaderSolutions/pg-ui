import { AccountsState } from './retrieveAccountsReducer';
import { AccountDetailState } from './retrieveAccountDetailReducer';
import { AccountDocumentationState } from './fetchAccountDocumentationReducer';
import { AccountUploadsState } from './fetchAccountUploadsReducer';
import { CreateAccountState } from './createAccount/CreateAccountState';

export interface HierarchyState {
    accounts: AccountsState;
    selected: AccountDetailState;
    selected_documentation: AccountDocumentationState;
    selected_uploads: AccountUploadsState;
    create_account: CreateAccountState;
}