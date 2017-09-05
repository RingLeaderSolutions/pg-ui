import { Portfolio } from '../../model/Models';
import { PortfolioHistoryState } from './portfolioHistoryReducer';
import { SelectedPortfolioState } from './selectedPortfolioReducer';
import { PortfolioMpanSummaryState } from './portfolioMpanSummaryReducer';
import { PortfolioSiteMpansState } from './portfolioSiteMpansReducer';

export interface PortfolioState {
    history: PortfolioHistoryState;
    selected: SelectedPortfolioState;
    mpan_summary: PortfolioMpanSummaryState;
    sites: PortfolioSiteMpansState;
}