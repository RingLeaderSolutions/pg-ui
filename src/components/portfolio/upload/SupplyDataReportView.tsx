import * as React from "react";
import { Portfolio, PortfolioDetails, UtilityType } from '../../../model/Models';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';

import Spinner from '../../common/Spinner';
import ErrorMessage from "../../common/ErrorMessage";
import * as moment from 'moment';
import DatePicker from 'react-datepicker';

import { SupplyDataUploadReport } from "../../../model/Models";

interface SupplyDataReportViewProps {
}

interface StateProps {
    working: boolean;
    error: boolean;
    errorMessage: string;
    uploadReport: SupplyDataUploadReport;
}
  
interface DispatchProps {
}

class SupplyDataReportView extends React.Component<SupplyDataReportViewProps & StateProps & DispatchProps, {}> {

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
                            <span className="icon-standard-cursor" data-uk-tooltip="title: Success" data-uk-icon="icon: check"></span>
                        ) : 
                        (
                            <span className="icon-standard-cursor" data-uk-tooltip="title: Failure" data-uk-icon="icon: close"></span>
                        )}</td>
                        <td>{index == 0 ? f.successCount : null}</td>
                        <td>{index == 0 ? f.failureCount : null}</td>
                    </tr>)
            })
        });
    }

    renderTable(){
        var rows = this.renderTableRows();
        return (
            <table className="uk-table uk-table-divider">
                <thead>
                    <tr>
                        <th>File</th>
                        <th>Category</th>
                        <th>Entity</th>
                        <th>Result</th>
                        <th>Failure</th>
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
        if(this.props.working || this.props.uploadReport == null){
            return (<div className="uk-modal-dialog upload-report-modal uk-modal-body"><Spinner hasMargin={true} /></div>);
        }
        return (
            <div className="uk-modal-dialog upload-report-modal">
                <button className="uk-modal-close-default" type="button" data-uk-close></button>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title">Upload Report: {this.props.uploadReport.uploadType}</h2>
                </div>
                <div className="uk-modal-body uk-overflow-auto">
                    {this.renderTable()}
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-right uk-modal-close" type="button">Close</button>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, SupplyDataReportViewProps> = (dispatch) => {
    return {
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, SupplyDataReportViewProps> = (state: ApplicationState) => {
    return {
        uploadReport: state.portfolio.selected_upload_report.value,
        working: state.portfolio.selected_upload_report.working,
        error: state.portfolio.selected_upload_report.error,
        errorMessage: state.portfolio.selected_upload_report.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(SupplyDataReportView);