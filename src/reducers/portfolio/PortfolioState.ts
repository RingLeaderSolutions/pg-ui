import { PortfolioHistoryState } from './portfolioHistoryReducer';
import { SelectedPortfolioState } from './selectedPortfolioReducer';
import { PortfolioMpanSummaryState } from './portfolioMpanSummaryReducer';
import { PortfolioSiteMpansState } from './portfolioSiteMpansReducer';
import { MpanToplineState } from './mpanToplineReducer';
import { MpanHistoricalState } from './mpanHistoricalReducer';
import { PortfolioDetailsState } from './portfolioDetailsReducer';

export interface PortfolioState {
    details: PortfolioDetailsState;
    history: PortfolioHistoryState;
    selected: SelectedPortfolioState;
    mpan_summary: PortfolioMpanSummaryState;
    sites: PortfolioSiteMpansState;
    topline: MpanToplineState;
    historical: MpanHistoricalState;
}