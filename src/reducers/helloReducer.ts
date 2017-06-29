import * as types from '../actions/actionTypes';
import { reduceReducers } from './common';

var initialState : HelloState = {    
    name: null
};

export interface HelloState {
    name: string;
}

const documentGenerationReducer = (state : HelloState, action: any) => {
    switch (action.type) {
        case types.SAY_HELLO:
            return {
                name: action.name
            };
        default:
            return state;
    }
}

export default reduceReducers((state = initialState) => state, documentGenerationReducer);