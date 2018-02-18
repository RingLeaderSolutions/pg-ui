import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { RequestState, idleInitialRequestState } from '../RequestState';

const generateSummaryReportReducer = requestResponseReducer(
    types.GENERATE_SUMMARY_REPORT_WORKING,
    types.GENERATE_SUMMARY_REPORT_SUCCESSFUL,
    types.GENERATE_SUMMARY_REPORT_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,  
            error: false
        };
    }
);

export default reduceReducers((state = idleInitialRequestState) => state, generateSummaryReportReducer);