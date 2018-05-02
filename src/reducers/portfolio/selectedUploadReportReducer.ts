import * as types from '../../actions/actionTypes';
import { reduceReducers, requestResponseReducer } from '../common';
import { UploadReportBase } from '../../model/Models';
import { RequestState, initialRequestState } from '../RequestState';

export interface SelectedUploadReportState extends RequestState {
    value: UploadReportBase;
}

const selectedUploadReportReducer = requestResponseReducer(
    types.FETCH_UPLOAD_REPORT_WORKING,
    types.FETCH_UPLOAD_REPORT_SUCCESSFUL,
    types.FETCH_UPLOAD_REPORT_FAILED,
    (state, action) => {
        return {
            ...state,
            working: false,         
            error: false,   
            value: action.data
        };
    }
);

export default reduceReducers((state = initialRequestState) => state, selectedUploadReportReducer);