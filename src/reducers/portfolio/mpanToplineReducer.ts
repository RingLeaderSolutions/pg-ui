import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { MpanTopline } from '../../model/Models';
import { RequestState, initialRequestState } from '../RequestState';

export interface MpanToplineState extends RequestState {
    value: MpanTopline;
}

const mpanToplineReducer = requestResponseReducer(
    types.FETCH_MPAN_TOPLINE_WORKING,
    types.FETCH_MPAN_TOPLINE_SUCCESSFUL,
    types.FETCH_MPAN_TOPLINE_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,         
            error: false,   
            value: action.data
        };
    }
);

export default reduceReducers((state = initialRequestState) => state, mpanToplineReducer);