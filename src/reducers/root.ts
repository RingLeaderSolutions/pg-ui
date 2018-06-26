import { combineReducers, Reducer } from 'redux';
import { ApplicationState } from '../applicationState';
import { reduceReducers } from './common';
import { initialRequestState } from './RequestState';

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

import allPortfoliosReducer from './portfolios/allPortfoliosReducer';
import { PortfoliosState } from './portfolios/PortfoliosState';

const portfoliosReducer: Reducer<PortfoliosState> = combineReducers<PortfoliosState>({
    all: allPortfoliosReducer
});

import { TenderState } from './tender/TenderState';

import addExistingContractReducer from './tender/addExistingContractReducer';
import tendersReducer from './tender/tendersReducer';
import tenderSuppliersReducer from './tender/tenderSuppliersReducer';
import deleteTenderReducer from './tender/deleteTenderReducer';
import deleteQuoteReducer from './tender/deleteQuoteReducer';
import createTenderReducer from './tender/createTenderReducer';
import updateTenderSuppliersReducer from './tender/updateTenderSuppliersReducer';
import updateTenderReducer from './tender/updateTenderReducer';
import generateTenderPackReducer from './tender/generateTenderPackReducer';
import issueTenderPackReducer from './tender/issueTenderPackReducer';
import issueSummaryReportReducer from './tender/issueSummaryReportReducer';
import generateSummaryReportReducer from './tender/generateSummaryReportReducer';
import fetchBackingSheetsReducer from './tender/fetchBackingSheetsReducer';
import fetchTenderIssuanceEmailReducer from './tender/fetchTenderIssuanceEmailReducer';
import fetchTariffsReducer from './tender/fetchTariffsReducer';

const tenderReducer: Reducer<TenderState> = combineReducers<TenderState>({
    tenders: tendersReducer,
    suppliers: tenderSuppliersReducer,
    addExistingContract: addExistingContractReducer,
    delete_tender: deleteTenderReducer,
    create_tender: createTenderReducer,
    update_tender_suppliers: updateTenderSuppliersReducer,
    update_tender: updateTenderReducer,
    generate_pack: generateTenderPackReducer,
    issue_pack: issueTenderPackReducer,
    generate_summary: generateSummaryReportReducer,
    issue_summary: issueSummaryReportReducer,
    backing_sheets: fetchBackingSheetsReducer,
    issuance_email: fetchTenderIssuanceEmailReducer,
    tariffs: fetchTariffsReducer,
    delete_quote: deleteQuoteReducer
});

// Combine portfolio reducers to form the PortfolioState
import { PortfolioState } from './portfolio/PortfolioState';

import portfolioAccountReducer from './portfolio/portfolioAccountReducer';
import portfolioDetailsReducer from './portfolio/portfolioDetailsReducer';
import selectedPortfolioReducer from './portfolio/selectedPortfolioReducer';
import portfolioHistoryReducer from './portfolio/portfolioHistoryReducer';
import portfolioUploadsReducer from './portfolio/portfolioUploadsReducer';
import { clearPortfolioOnTabSwitchReducer } from './portfolio/clearPortfolioOnTabSwitchReducer';

const portfolioStateReducer: Reducer<PortfolioState> = combineReducers<PortfolioState>({
    account: portfolioAccountReducer,
    details: portfolioDetailsReducer,
    selected: selectedPortfolioReducer,
    history: portfolioHistoryReducer,
    tender: tenderReducer,
    uploads: portfolioUploadsReducer
});

var portfolioReducer = reduceReducers(portfolioStateReducer, clearPortfolioOnTabSwitchReducer)

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
import fetchMeterConsumptionReducer from './meters/fetchMeterConsumptionReducer';

var meterReducer : Reducer<MeterState> = combineReducers<MeterState>({
    all: metersRetrievalReducer,
    consumption: fetchMeterConsumptionReducer,
    update: meterUpdateReducer
});

var completeMeterReducer = reduceReducers((state: MeterState = {
    all: initialRequestState,
    update: initialRequestState,
    consumption: initialRequestState
}) => state, meterReducer, meterEditReducer);

import fetchBackendVersionReducer from './fetchBackendVersionReducer';

// Portfolios - contains all portfolios and manages creation state
import { CreateAccountState } from './hierarchy/createAccount/CreateAccountState';
import companySearchReducer from './hierarchy/createAccount/companySearchReducer';
import createAccountReducer from './hierarchy/createAccount/createAccountReducer';
import creationStageReducer from './hierarchy/createAccount/creationStageReducer';

const accountCreationReducer: Reducer<CreateAccountState> = combineReducers<CreateAccountState>({
    stage: creationStageReducer,

    company: companySearchReducer,
    account: createAccountReducer
});


import { HierarchyState } from './hierarchy/HierarchyState'
import retrieveAccountsReducer from './hierarchy/retrieveAccountsReducer';
import retrieveAccountDetailReducer from './hierarchy/retrieveAccountDetailReducer';
import fetchAccountDocumentationReducer from './hierarchy/fetchAccountDocumentationReducer';
import fetchAccountUploadsReducer from './hierarchy/fetchAccountUploadsReducer';
import fetchAccountPortfoliosReducer from './hierarchy/fetchAccountPortfoliosReducer';

const hierarchyReducer: Reducer<HierarchyState> = combineReducers<HierarchyState>({
    accounts: retrieveAccountsReducer,
    selected: retrieveAccountDetailReducer,
    selected_documentation: fetchAccountDocumentationReducer,
    selected_uploads: fetchAccountUploadsReducer,
    create_account: accountCreationReducer,
    selected_portfolios: fetchAccountPortfoliosReducer
});

import { ViewState } from './view/ViewState';
import { portfolioViewReducer } from './view/portfolioViewReducer';
import { accountViewReducer } from './view/accountViewReducer';
import { modalDialogReducer } from './view/modalDialogReducer';
import { appViewReducer } from './view/appViewReducer';

const viewReducer: Reducer<ViewState> = combineReducers<ViewState>({
    portfolio: portfolioViewReducer,
    account: accountViewReducer,
    modal: modalDialogReducer,
    app: appViewReducer
});

import selectedUploadReportReducer from './selectedUploadReportReducer';
import fetchUsersReducer from './fetchUsersReducer';
import fetchInstanceDetailReducer from './fetchInstanceDetailReducer';

// Combine all reducers to form the master ApplicationState
const rootReducer: Reducer<ApplicationState> = combineReducers<ApplicationState>({
    portfolio: portfolioReducer,
    dashboard: dashboardReducer,
    portfolios: portfoliosReducer,
    notifications: notificationMessageReducer,    
    auth: authReducer,
    meters: completeMeterReducer,
    backend_version: fetchBackendVersionReducer,
    instance_detail: fetchInstanceDetailReducer,
    hierarchy: hierarchyReducer,
    selected_upload_report: selectedUploadReportReducer,
    users: fetchUsersReducer,
    view: viewReducer
});

export default rootReducer;