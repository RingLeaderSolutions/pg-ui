import { combineReducers, Reducer } from 'redux';
import { ApplicationState } from '../applicationState';
import { reduceReducers, requestResponseReducer } from './common';
import { RequestState, initialRequestState } from './RequestState';

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
import createAccountReducer from './portfolios/create/createAccountReducer';
import createPortfolioReducer from './portfolios/create/createPortfolioReducer';
import creationStageReducer from './portfolios/create/creationStageReducer';

const portfolioCreationReducer: Reducer<CreatePortfolioState> = combineReducers<CreatePortfolioState>({
    stage: creationStageReducer,

    company: companySearchReducer,
    account: createAccountReducer,
    portfolio: createPortfolioReducer
});

import allPortfoliosReducer from './portfolios/allPortfoliosReducer';
import { AllPortfoliosState } from './portfolios/allPortfoliosReducer';
import { PortfoliosState } from './portfolios/PortfoliosState';

const portfoliosReducer: Reducer<PortfoliosState> = combineReducers<PortfoliosState>({
    all: allPortfoliosReducer,
    create: portfolioCreationReducer
});

import { TenderState } from './tender/TenderState';

import addExistingContractReducer from './tender/addExistingContractReducer';
import tendersReducer from './tender/tendersReducer';
import tenderSuppliersReducer from './tender/tenderSuppliersReducer';

const tenderReducer: Reducer<TenderState> = combineReducers<TenderState>({
    tenders: tendersReducer,
    suppliers: tenderSuppliersReducer,
    addExistingContract: addExistingContractReducer
});

// Combine portfolio reducers to form the PortfolioState
import { PortfolioState } from './portfolio/PortfolioState';

import portfolioAccountReducer from './portfolio/portfolioAccountReducer';
import portfolioDetailsReducer from './portfolio/portfolioDetailsReducer';
import selectedPortfolioReducer from './portfolio/selectedPortfolioReducer';
import portfolioHistoryReducer from './portfolio/portfolioHistoryReducer';

import mpanToplineReducer from './portfolio/mpanToplineReducer';
import mpanHistoricalReducer from './portfolio/mpanHistoricalReducer';


const portfolioReducer: Reducer<PortfolioState> = combineReducers<PortfolioState>({
    account: portfolioAccountReducer,
    details: portfolioDetailsReducer,
    selected: selectedPortfolioReducer,
    history: portfolioHistoryReducer,
    topline: mpanToplineReducer,
    historical: mpanHistoricalReducer,
    tender: tenderReducer
});

import notificationMessageReducer from './notifications/notificationMessageReducer';

import { AuthState } from './auth/AuthState'
import loginReducer from './auth/loginReducer';

const authReducer: Reducer<AuthState> = combineReducers<AuthState>({
    login: loginReducer
});

import { MeterState } from './meters/MeterState'

import metersRetrievalReducer from './meters/metersRetrievalReducer';
import meterUpdateReducer from './meters/meterUpdateReducer';
import meterEditReducer from './meters/meterEditReducer';

var meterReducer : Reducer<MeterState> = combineReducers<MeterState>({
    all: metersRetrievalReducer,
    update: meterUpdateReducer
});

var completeMeterReducer = reduceReducers((state: MeterState = {
    all: initialRequestState,
    update: initialRequestState,
}) => state, meterReducer, meterEditReducer);

// Combine all reducers to form the master ApplicationState
const rootReducer: Reducer<ApplicationState> = combineReducers<ApplicationState>({
    portfolio: portfolioReducer,
    dashboard: dashboardReducer,
    portfolios: portfoliosReducer,
    notifications: notificationMessageReducer,    
    auth: authReducer,
    meters: completeMeterReducer,
});

export default rootReducer;