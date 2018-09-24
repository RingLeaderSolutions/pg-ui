import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';

import Spinner from '../../common/Spinner';

import { ImportReportDetail } from "../../../model/Models";
import { TemplateResult, FieldAction } from "../../../model/Uploads";
import ErrorMessage from "../../common/ErrorMessage";
import { closeModalDialog } from "../../../actions/viewActions";

interface QuoteImportReportViewProps {
}

interface StateProps {
    working: boolean;
    error: boolean;
    errorMessage: string;
    uploadReport: ImportReportDetail;
}
  
interface DispatchProps {
    closeModalDialog: () => void;
}

class QuoteImportReportView extends React.Component<QuoteImportReportViewProps & StateProps & DispatchProps, {}> {

    // renderFunctionsUsedTable(template: ImportTemplateReport){
    //     var functionsKeys = Object.keys(template.functionsUsed);
    //     var rows = functionsKeys.map((k) => {
    //        return (
    //            <tr>
    //                <td>{k}</td>
    //                <td>{template.functionsUsed[k]}</td>
    //            </tr>
    //        )
    //     });
    //     return (
    //         <table className="uk-table uk-table-divider">
    //             <thead>
    //                 <tr>
    //                     <th>Function name</th>
    //                     <th>Count (#)</th>
    //                 </tr>
    //             </thead>
    //             <tbody>
    //                 {rows}
    //             </tbody>
    //         </table>)
    // }

    renderUnmappedColumnsTable(template: TemplateResult){
        var rows = template.unmappedColumns
            .sort(
                (col1: string, col2: string) => {        
                    if (col1 < col2) return -1;
                    if (col1 > col2) return 1;
                    return 0;
                })
            .map((col) => {
            return (
                <tr key={col}>
                    <td>{col}</td>
                </tr>
            )
            });
            
        return (
            <table className="uk-table uk-table-divider">
                <thead>
                    <tr>
                        <th>Column Name</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>)
    }

    renderImportResultsTable(template: TemplateResult){
        var rows = template.recordActions.map((ra) => {
            return ra.fieldActions.map((fieldAction: FieldAction, index: number) => {
                return (
                    <tr key={index}>
                        <td>{index == 0 ? ra.record : null}</td>
                        <td>{fieldAction.field}</td>
                        <td>{fieldAction.status}</td>
                        <td>{fieldAction.description}</td>
                    </tr>
                )
            });
        });
        return (
            <table className="uk-table uk-table-divider">
                <thead>
                    <tr>
                        <th>Record #</th>
                        <th>Field</th>
                        <th>Status</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>)
    }

    renderValidationErrors(uploadReport: ImportReportDetail){
        var rows = uploadReport.fieldValidationErrorsList.map((ve, index) => {
            var key = `ve-${index}`;
            return (
                <tr key={key}>
                    <td>{ve.entity}</td>
                    <td>{ve.errors.join(', ')}</td>
                </tr> 
            );
        });
        
        return (
            <table className="uk-table uk-table-divider">
                <thead>
                    <tr>
                        <th>Record</th>
                        <th>Validation Error(s)</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>)
        }

    render() {
        var { uploadReport } = this.props;
        if(this.props.working || uploadReport == null || uploadReport.templateResults == null){
            return (<div className="uk-modal-body"><Spinner hasMargin={true} /></div>);
        }
        if(this.props.error || uploadReport.templateResults.length == 0){
            return (<ErrorMessage content="Sorry! We've encountered an error loading the import report for this. Please contact support."/>);
        }
        var template = uploadReport.templateResults[0];
        var downloadTooltip = `title: ${uploadReport.originalFileName}`
        
        var unmappedCount = template.unmappedColumns.length;
        var hasValidationErrors = uploadReport.fieldValidationErrorsList != null && uploadReport.fieldValidationErrorsList.length > 0;
        var validationErrorCount = hasValidationErrors ? uploadReport.fieldValidationErrorsList.length : 0;

        return (
            <div>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title">Quote Import: {template.type}</h2>
                </div>
                <div className="uk-modal-body uk-overflow-auto">
                    <div className="uk-grid" data-uk-grid>
                        <div className="uk-width-expand@s"></div>
                        <div className="uk-width-auto@s" data-uk-tooltip={downloadTooltip}>
                            {uploadReport.originalFileNameURI ? (
                                <p className="download-report">
                                    <a className="uk-button uk-button-default uk-button-small" href={uploadReport.originalFileNameURI} target="_blank">
                                        <i className="fas fa-cloud-download-alt uk-margin-small-right"></i> Download
                                    </a>
                                </p>) : null}
                        </div>
                    </div>
                    <ul className="uk-tab" data-uk-switcher="connect: +.uk-switcher">
                        <li><a href="#">Import results</a></li>
                        { unmappedCount > 0 ? (<li><a href="#">Unmapped Columns ({unmappedCount})</a></li>) : null }
                        { hasValidationErrors ? (<li><a href="#">Validation Errors ({validationErrorCount})</a></li>) : null }
                    </ul>
                    <ul className="uk-switcher">
                        <li>{this.renderImportResultsTable(template)}</li>
                        { unmappedCount > 0 ? (<li>{this.renderUnmappedColumnsTable(template)}</li>) : null }
                        { hasValidationErrors ? (<li>{this.renderValidationErrors(uploadReport)}</li>) : null }
                    </ul>
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-right" type="button" onClick={() => this.props.closeModalDialog()}>Close</button>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, QuoteImportReportViewProps> = (dispatch) => {
    return {
        closeModalDialog: () => dispatch(closeModalDialog()) 
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, QuoteImportReportViewProps, ApplicationState> = (state: ApplicationState) => {
    return {
        uploadReport: state.selected_upload_report.value as ImportReportDetail,
        working: state.selected_upload_report.working,
        error: state.selected_upload_report.error,
        errorMessage: state.selected_upload_report.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(QuoteImportReportView);