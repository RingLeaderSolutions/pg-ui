import { PortfolioHistoryState } from './portfolioHistoryReducer';
import { SelectedPortfolioState } from './selectedPortfolioReducer';
import { PortfolioSiteMpansState } from './portfolioSiteMpansReducer';
import { MpanToplineState } from './mpanToplineReducer';
import { MpanHistoricalState } from './mpanHistoricalReducer';
import { PortfolioDetailsState } from './portfolioDetailsReducer';
import { PortfolioAccountState } from './portfolioAccountReducer';

export interface PortfolioState {
    account: PortfolioAccountState;
    details: PortfolioDetailsState;
    history: PortfolioHistoryState;
    selected: SelectedPortfolioState;
    sites: PortfolioSiteMpansState;
    topline: MpanToplineState;
    historical: MpanHistoricalState;
}