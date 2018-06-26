import { PortfolioHistoryState } from './portfolioHistoryReducer';
import { SelectedPortfolioState } from './selectedPortfolioReducer';
import { PortfolioDetailsState } from './portfolioDetailsReducer';
import { PortfolioAccountState } from './portfolioAccountReducer';
import { PortfolioUploadsState } from './portfolioUploadsReducer';

import { TenderState } from '../tender/TenderState';

export interface PortfolioState {
    account: PortfolioAccountState;
    details: PortfolioDetailsState;
    history: PortfolioHistoryState;
    selected: SelectedPortfolioState;
    tender: TenderState;
    uploads: PortfolioUploadsState;
}