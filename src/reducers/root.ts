import { combineReducers, Reducer } from 'redux';

import { ApplicationState } from '../applicationState';

import portfolioReducer from './portfolioReducer';

const rootReducer: Reducer<ApplicationState> = combineReducers<ApplicationState>({
    portfolio: portfolioReducer
});

export default rootReducer;