import { PortfolioHistoryState } from './portfolioHistoryReducer';
import { SelectedPortfolioState } from './selectedPortfolioReducer';
import { MpanToplineState } from './mpanToplineReducer';
import { MpanHistoricalState } from './mpanHistoricalReducer';
import { PortfolioDetailsState } from './portfolioDetailsReducer';
import { PortfolioAccountState } from './portfolioAccountReducer';
import { TenderState } from '../tender/TenderState';
import { RequestState } from '../RequestState';

export interface PortfolioState {
    account: PortfolioAccountState;
    details: PortfolioDetailsState;
    history: PortfolioHistoryState;
    selected: SelectedPortfolioState;
    topline: MpanToplineState;
    historical: MpanHistoricalState;
    tender: TenderState;
    update_requirements: RequestState;
    create_contact: RequestState;
}