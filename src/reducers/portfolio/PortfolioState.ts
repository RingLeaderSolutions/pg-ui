import { PortfolioHistoryState } from './portfolioHistoryReducer';
import { SelectedPortfolioState } from './selectedPortfolioReducer';
import { PortfolioMpanSummaryState } from './portfolioMpanSummaryReducer';
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
    mpan_summary: PortfolioMpanSummaryState;
    sites: PortfolioSiteMpansState;
    topline: MpanToplineState;
    historical: MpanHistoricalState;
}