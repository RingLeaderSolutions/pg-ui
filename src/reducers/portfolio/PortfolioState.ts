import { PortfolioHistoryState } from './portfolioHistoryReducer';
import { SelectedPortfolioState } from './selectedPortfolioReducer';
import { PortfolioDetailsState } from './portfolioDetailsReducer';
import { PortfolioAccountState } from './portfolioAccountReducer';
import { PortfolioUploadsState } from './portfolioUploadsReducer';

import { TenderState } from '../tender/TenderState';
import { RequestState } from '../RequestState';

export interface PortfolioState {
    account: PortfolioAccountState;
    details: PortfolioDetailsState;
    history: PortfolioHistoryState;
    selected: SelectedPortfolioState;
    tender: TenderState;
    update_requirements: RequestState;
    create_contact: RequestState;
    uploads: PortfolioUploadsState;
}