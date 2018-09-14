import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../applicationState';

import Spinner from './Spinner';

import { UploadReportDetail } from "../../model/Models";
import { closeModalDialog } from "../../actions/viewActions";

interface UploadReportViewProps {
}

interface StateProps {
    working: boolean;
    error: boolean;
    errorMessage: string;
    uploadReport: UploadReportDetail;
}
  
interface DispatchProps {
    closeModalDialog: () => void;
}

class UploadReportView extends React.Component<UploadReportViewProps & StateProps & DispatchProps, {}> {
    renderTableRows(){
        return this.props.uploadReport.uploadFiles.map(f => {
            return f.activity.map( (a, index) => {
                return (
                    <tr key={index}>
                        <td>{index == 0 ? f.fileName : null}</td>
                        <td>{a.category}</td>
                        <td>{a.entity}</td>
                        <td>{a.message}</td>
                        <td>{a.failure ? (
                            <i className="fas fa-exclamation-circle" style={{color: "#FF0000"}} data-uk-tooltip="title: Failure"></i>
                        ) : 
                        (
                            <i className="fas fa-check-circle" style={{color: "#006400"}} data-uk-tooltip="title: Success"></i>
                        )}</td>
                        <td>{index == 0 ? f.successCount : null}</td>
                        <td>{index == 0 ? f.failureCount : null}</td>
                    </tr>)
            })
        });
    }

    renderTable(){
        return (
            <table className="uk-table uk-table-divider">
                <thead>
                    <tr>
                        <th>File</th>
                        <th>Category</th>
                        <th>Entity</th>
                        <th>Result</th>
                        <th>Successful</th>
                        <th># Successful</th>
                        <th># Failed</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderTableRows()}
                </tbody>
            </table>)
    }
    render() {
        if(this.props.working || this.props.uploadReport == null || this.props.uploadReport.uploadFiles == null){
            return (<div className="uk-modal-body"><Spinner hasMargin={true} /></div>);
        }
        return (
            <div>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title"><i className="fa fa-file-upload uk-margin-right"></i>Upload Report: {this.props.uploadReport.uploadType}</h2>
                </div>
                <div className="uk-modal-body uk-overflow-auto">
                    {this.renderTable()}
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-right" type="button" onClick={() => this.props.closeModalDialog()}><i className="fa fa-times uk-margin-small-right"></i>Close</button>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, UploadReportViewProps> = (dispatch) => {
    return {
        closeModalDialog: () => dispatch(closeModalDialog()) 
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, UploadReportViewProps> = (state: ApplicationState) => {
    return {
        uploadReport: state.selected_upload_report.value as UploadReportDetail,
        working: state.selected_upload_report.working,
        error: state.selected_upload_report.error,
        errorMessage: state.selected_upload_report.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(UploadReportView);