import { combineReducers, Reducer } from 'redux';

import { ApplicationState } from '../applicationState';

import helloReducer from './helloReducer';

const rootReducer: Reducer<ApplicationState> = combineReducers<ApplicationState>({
    hello: helloReducer
});

export default rootReducer;