import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { idleInitialRequestState } from '../RequestState';

const issueSummaryReportReducer = requestResponseReducer(
    types.ISSUE_SUMMARY_REPORT_WORKING,
    types.ISSUE_SUMMARY_REPORT_SUCCESSFUL,
    types.ISSUE_SUMMARY_REPORT_FAILED,
    (state) => {
        return {
            ...state,
            working: false,  
            error: false
        };
    }
);

export default reduceReducers((state = idleInitialRequestState) => state, issueSummaryReportReducer);