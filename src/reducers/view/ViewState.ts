import { AccountViewState } from './accountViewReducer';
import { PortfolioViewState } from './portfolioViewReducer';
import { ModalDialogState } from './modalDialogReducer';

export interface ViewState {
    portfolio: PortfolioViewState;
    account: AccountViewState;
    modal: ModalDialogState;
}

export const initialSelectedTabState = {
    selectedIndex: 0
}