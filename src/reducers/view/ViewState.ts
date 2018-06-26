import { AccountViewState } from './accountViewReducer';
import { PortfolioViewState } from './portfolioViewReducer';
import { ModalDialogState } from './modalDialogReducer';
import { ApplicationViewState } from './appViewReducer';

export interface ViewState {
    portfolio: PortfolioViewState;
    account: AccountViewState;
    modal: ModalDialogState;
    app: ApplicationViewState;
}

export const initialSelectedTabState = {
    selectedIndex: 0
}