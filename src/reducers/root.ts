import { combineReducers, Reducer } from 'redux';
import { ApplicationState } from '../applicationState';

// Combine dashboard reducers to form the DashboardState
import { DashboardState } from './dashboard/DashboardState';

import dashboardSummaryReducer from './dashboard/dashboardSummaryReducer';
import dashboardStatusReducer from './dashboard/dashboardStatusReducer';
import dashboardTimelineReducer from './dashboard/dashboardTimelineReducer';

const dashboardReducer: Reducer<DashboardState> = combineReducers<DashboardState>({
    summary: dashboardSummaryReducer,
    status: dashboardStatusReducer,
    timeline: dashboardTimelineReducer
});

// Portfolios - simplistic 
import portfoliosReducer from './portfolios/portfoliosReducer';

// Combine portfolio reducers to form the PortfolioState
import { PortfolioState } from './portfolio/PortfolioState';

import selectedPortfolioReducer from './portfolio/selectedPortfolioReducer';
import portfolioHistoryReducer from './portfolio/portfolioHistoryReducer';
import portfolioMpanSummaryReducer from './portfolio/portfolioMpanSummaryReducer';
import portfolioSiteMpansReducer from './portfolio/portfolioSiteMpansReducer';

import mpanToplineReducer from './portfolio/mpanToplineReducer';
import mpanHistoricalReducer from './portfolio/mpanHistoricalReducer';
import notificationMessageReducer from './notifications/notificationMessageReducer';

const portfolioReducer: Reducer<PortfolioState> = combineReducers<PortfolioState>({
    selected: selectedPortfolioReducer,
    history: portfolioHistoryReducer,
    mpan_summary: portfolioMpanSummaryReducer,
    sites: portfolioSiteMpansReducer,
    topline: mpanToplineReducer,
    historical: mpanHistoricalReducer    
});

// Combine all reducers to form the master ApplicationState
const rootReducer: Reducer<ApplicationState> = combineReducers<ApplicationState>({
    portfolio: portfolioReducer,
    dashboard: dashboardReducer,
    portfolios: portfoliosReducer,
    notifications: notificationMessageReducer
});

export default rootReducer;