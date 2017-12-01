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

// Portfolios - contains all portfolios and manages creation state
import { CreatePortfolioState } from './portfolios/create/CreatePortfolioState';
import companySearchReducer from './portfolios/create/companySearchReducer';

const createPortfolioReducer: Reducer<CreatePortfolioState> = combineReducers<CreatePortfolioState>({
    company: companySearchReducer
})

import allPortfoliosReducer from './portfolios/allPortfoliosReducer';
import { AllPortfoliosState } from './portfolios/allPortfoliosReducer';
import { PortfoliosState } from './portfolios/PortfoliosState';

const portfoliosReducer: Reducer<PortfoliosState> = combineReducers<PortfoliosState>({
    all: allPortfoliosReducer,
    create: createPortfolioReducer
})

// Combine portfolio reducers to form the PortfolioState
import { PortfolioState } from './portfolio/PortfolioState';

import portfolioDetailsReducer from './portfolio/portfolioDetailsReducer';
import selectedPortfolioReducer from './portfolio/selectedPortfolioReducer';
import portfolioHistoryReducer from './portfolio/portfolioHistoryReducer';
import portfolioMpanSummaryReducer from './portfolio/portfolioMpanSummaryReducer';
import portfolioSiteMpansReducer from './portfolio/portfolioSiteMpansReducer';

import mpanToplineReducer from './portfolio/mpanToplineReducer';
import mpanHistoricalReducer from './portfolio/mpanHistoricalReducer';

const portfolioReducer: Reducer<PortfolioState> = combineReducers<PortfolioState>({
    details: portfolioDetailsReducer,
    selected: selectedPortfolioReducer,
    history: portfolioHistoryReducer,
    mpan_summary: portfolioMpanSummaryReducer,
    sites: portfolioSiteMpansReducer,
    topline: mpanToplineReducer,
    historical: mpanHistoricalReducer    
});

import notificationMessageReducer from './notifications/notificationMessageReducer';

import { AuthState } from './auth/AuthState'
import loginReducer from './auth/loginReducer';

const authReducer: Reducer<AuthState> = combineReducers<AuthState>({
    login: loginReducer
});

// Combine all reducers to form the master ApplicationState
const rootReducer: Reducer<ApplicationState> = combineReducers<ApplicationState>({
    portfolio: portfolioReducer,
    dashboard: dashboardReducer,
    portfolios: portfoliosReducer,
    notifications: notificationMessageReducer,
    auth: authReducer
});

export default rootReducer;