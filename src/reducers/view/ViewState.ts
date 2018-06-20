import { AccountViewState } from './accountViewReducer';
import { PortfolioViewState } from './portfolioViewReducer';

export interface ViewState {
    portfolio: PortfolioViewState;
    account: AccountViewState;
}

export const initialSelectedTabState = {
    selectedIndex: 0
}