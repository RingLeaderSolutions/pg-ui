import { combineReducers, Reducer } from 'redux';

import { ApplicationState } from '../applicationState';

import portfolioReducer from './portfolioReducer';
import dashboardReducer from './dashboardReducer';

const rootReducer: Reducer<ApplicationState> = combineReducers<ApplicationState>({
    portfolio: portfolioReducer,
    dashboard: dashboardReducer
});

export default rootReducer;