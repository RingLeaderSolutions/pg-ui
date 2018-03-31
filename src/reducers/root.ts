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
import deleteTenderReducer from './tender/deleteTenderReducer';
import createGasTenderReducer from './tender/createGasTenderReducer';
import createHHElectricityTenderReducer from './tender/createHHElectricityTenderReducer';
import createNHHElectricityTenderReducer from './tender/createNHHElectricityTenderReducer';
import updateTenderSuppliersReducer from './tender/updateTenderSuppliersReducer';
import updateTenderReducer from './tender/updateTenderReducer';
import generateTenderPackReducer from './tender/generateTenderPackReducer';
import issueTenderPackReducer from './tender/issueTenderPackReducer';
import issueSummaryReportReducer from './tender/issueSummaryReportReducer';
import generateSummaryReportReducer from './tender/generateSummaryReportReducer';
import fetchBackingSheetsReducer from './tender/fetchBackingSheetsReducer';
import fetchTenderIssuanceEmailReducer from './tender/fetchTenderIssuanceEmailReducer';
import fetchTariffsReducer from './tender/fetchTariffsReducer';
import updateTenderRequirementsReducer from './tender/updateTenderRequirementsReducer';

const tenderReducer: Reducer<TenderState> = combineReducers<TenderState>({
    tenders: tendersReducer,
    suppliers: tenderSuppliersReducer,
    addExistingContract: addExistingContractReducer,
    delete_tender: deleteTenderReducer,
    create_hh_electricity_tender: createHHElectricityTenderReducer,
    create_nhh_electricity_tender: createNHHElectricityTenderReducer,
    create_gas_tender: createGasTenderReducer,
    update_tender_suppliers: updateTenderSuppliersReducer,
    update_tender: updateTenderReducer,
    generate_pack: generateTenderPackReducer,
    issue_pack: issueTenderPackReducer,
    generate_summary: generateSummaryReportReducer,
    issue_summary: issueSummaryReportReducer,
    backing_sheets: fetchBackingSheetsReducer,
    issuance_email: fetchTenderIssuanceEmailReducer,
    tariffs: fetchTariffsReducer,
    update_requirements: updateTenderRequirementsReducer
});

// Combine portfolio reducers to form the PortfolioState
import { PortfolioState } from './portfolio/PortfolioState';

import portfolioAccountReducer from './portfolio/portfolioAccountReducer';
import portfolioDetailsReducer from './portfolio/portfolioDetailsReducer';
import selectedPortfolioReducer from './portfolio/selectedPortfolioReducer';
import portfolioHistoryReducer from './portfolio/portfolioHistoryReducer';

import mpanToplineReducer from './portfolio/mpanToplineReducer';
import mpanHistoricalReducer from './portfolio/mpanHistoricalReducer';
import updateRequirementsReducer from './portfolio/updateRequirementsReducer';
import createContactReducer from './portfolio/createContactReducer';

const portfolioReducer: Reducer<PortfolioState> = combineReducers<PortfolioState>({
    account: portfolioAccountReducer,
    details: portfolioDetailsReducer,
    selected: selectedPortfolioReducer,
    history: portfolioHistoryReducer,
    topline: mpanToplineReducer,
    historical: mpanHistoricalReducer,
    tender: tenderReducer,
    update_requirements: updateRequirementsReducer,
    create_contact: createContactReducer
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

import fetchBackendVersionReducer from './fetchBackendVersionReducer';

// Combine all reducers to form the master ApplicationState
const rootReducer: Reducer<ApplicationState> = combineReducers<ApplicationState>({
    portfolio: portfolioReducer,
    dashboard: dashboardReducer,
    portfolios: portfoliosReducer,
    notifications: notificationMessageReducer,    
    auth: authReducer,
    meters: completeMeterReducer,
    backend_version: fetchBackendVersionReducer
});

export default rootReducer;