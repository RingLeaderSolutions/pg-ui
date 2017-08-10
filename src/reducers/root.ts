import { combineReducers, Reducer } from 'redux';

import { ApplicationState } from '../applicationState';

import helloReducer from './helloReducer';
import portfolioReducer from './portfolioReducer';

const rootReducer: Reducer<ApplicationState> = combineReducers<ApplicationState>({
    hello: helloReducer,
    portfolio: portfolioReducer
});

export default rootReducer;