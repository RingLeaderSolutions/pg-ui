import * as React from "react";
import { MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../applicationState';

import { UploadReportDetail } from "../../model/Models";
import AsModalDialog, { ModalDialogProps } from "./modal/AsModalDialog";
import { ModalDialogNames } from "./modal/ModalDialogNames";
import { ModalFooter, ModalHeader, ModalBody, Button } from "reactstrap";
import { LoadingIndicator } from "./LoadingIndicator";

interface StateProps {
    working: boolean;
    error: boolean;
    errorMessage: string;
    uploadReport: UploadReportDetail;
}

class UploadReportDialog extends React.Component<ModalDialogProps & StateProps, {}> {
    renderTableRows(){
        return this.props.uploadReport.uploadFiles.map(f => {
            return f.activity.map( (a, index) => {
                return (
                    <tr key={index}>
                        <td>{index == 0 ? f.fileName : null}</td>
                        <td>{a.category}</td>
                        <td>{a.entity}</td>
                        <td>{a.message}</td>
                        <td className="text-center">{a.failure ? (
                            <i className="fas fa-exclamation-circle text-danger"></i>
                        ) : 
                        (
                            <i className="fas fa-check-circle text-success"></i>
                        )}</td>
                        <td className="text-center">{index == 0 ? f.successCount : null}</td>
                        <td className="text-center">{index == 0 ? f.failureCount : null}</td>
                    </tr>)
            })
        });
    }

    render() {
        if(this.props.working || this.props.uploadReport == null || this.props.uploadReport.uploadFiles == null){
            return (<LoadingIndicator />)
        }

        return (
            <div className="modal-content">
                <ModalHeader toggle={this.props.toggle}><i className="fas fa-file-upload mr-2"></i>Upload Report: {this.props.uploadReport.uploadType}</ModalHeader>
                <ModalBody className="p-0" style={{overflow: 'auto'}}>
                    <table className="table">
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
                    </table>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={this.props.toggle}>
                        <i className="fas fa-times mr-1"></i>Close
                    </Button>
                </ModalFooter>
            </div>);
    }
}

const mapStateToProps: MapStateToProps<StateProps, {}, ApplicationState> = (state: ApplicationState) => {
    return {
        uploadReport: state.selected_upload_report.value as UploadReportDetail,
        working: state.selected_upload_report.working,
        error: state.selected_upload_report.error,
        errorMessage: state.selected_upload_report.errorMessage
    };
};

export default AsModalDialog<{}, StateProps>(
{ 
    name: ModalDialogNames.UploadReport, 
    centered: true, 
    backdrop: true,
    size: "lg"
}, mapStateToProps, null)(UploadReportDialog)