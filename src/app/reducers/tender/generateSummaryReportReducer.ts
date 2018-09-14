import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { idleInitialRequestState } from '../RequestState';

const generateSummaryReportReducer = requestResponseReducer(
    types.GENERATE_SUMMARY_REPORT_WORKING,
    types.GENERATE_SUMMARY_REPORT_SUCCESSFUL,
    types.GENERATE_SUMMARY_REPORT_FAILED,
    (state) => {
        return {
            ...state,
            working: false,  
            error: false
        };
    }
);

export default reduceReducers((state = idleInitialRequestState) => state, generateSummaryReportReducer);