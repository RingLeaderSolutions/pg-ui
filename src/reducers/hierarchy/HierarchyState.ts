import { AccountsState } from './retrieveAccountsReducer';
import { AccountDetailState } from './retrieveAccountDetailReducer';

export interface HierarchyState {
    accounts: AccountsState;
    selected: AccountDetailState;
}