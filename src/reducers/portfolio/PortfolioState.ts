import { PortfolioHistoryState } from './portfolioHistoryReducer';
import { SelectedPortfolioState } from './selectedPortfolioReducer';
import { PortfolioMpanSummaryState } from './portfolioMpanSummaryReducer';
import { PortfolioSiteMpansState } from './portfolioSiteMpansReducer';
import { MpanToplineState } from './mpanToplineReducer';
import { MpanHistoricalState } from './mpanHistoricalReducer';

export interface PortfolioState {
    history: PortfolioHistoryState;
    selected: SelectedPortfolioState;
    mpan_summary: PortfolioMpanSummaryState;
    sites: PortfolioSiteMpansState;
    topline: MpanToplineState;
    historical: MpanHistoricalState;
}