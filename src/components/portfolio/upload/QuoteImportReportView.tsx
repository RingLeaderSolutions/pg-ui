import * as React from "react";
import { Portfolio, PortfolioDetails, UtilityType } from '../../../model/Models';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';

import Spinner from '../../common/Spinner';
import ErrorMessage from "../../common/ErrorMessage";
import * as moment from 'moment';
import DatePicker from 'react-datepicker';

import { QuoteImportUploadReport } from "../../../model/Models";
import { ImportTemplateReport, FieldAction } from "../../../model/Uploads";

interface QuoteImportReportViewProps {
}

interface StateProps {
    working: boolean;
    error: boolean;
    errorMessage: string;
    uploadReport: QuoteImportUploadReport;
}
  
interface DispatchProps {
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

    renderUnmappedColumnsTable(template: ImportTemplateReport){
        var rows = template.unmappedColumns.map((col) => {
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

    renderImportResultsTable(template: ImportTemplateReport){
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

    render() {
        if(this.props.working || this.props.uploadReport == null || this.props.uploadReport.templateResults == null){
            return (<div className="uk-modal-dialog upload-report-modal uk-modal-body"><Spinner hasMargin={true} /></div>);
        }
        var template = this.props.uploadReport.templateResults[0];
        return (
            <div className="uk-modal-dialog upload-report-modal">
                <button className="uk-modal-close-default" type="button" data-uk-close></button>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title">Quote Import: {template.type}</h2>
                </div>
                <div className="uk-modal-body uk-overflow-auto">
                        <ul data-uk-tab>
                            <li><a href="#">Import results</a></li>
                            <li><a href="#">Unmapped Columns</a></li>
                        </ul>
                        <ul className="uk-switcher restrict-height-hack">
                            <li>{this.renderImportResultsTable(template)}</li>
                            <li>{this.renderUnmappedColumnsTable(template)}</li>
                        </ul>
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-right uk-modal-close" type="button">Close</button>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, QuoteImportReportViewProps> = (dispatch) => {
    return {
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, QuoteImportReportViewProps> = (state: ApplicationState) => {
    return {
        uploadReport: state.portfolio.selected_upload_report.value as QuoteImportUploadReport,
        working: state.portfolio.selected_upload_report.working,
        error: state.portfolio.selected_upload_report.error,
        errorMessage: state.portfolio.selected_upload_report.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(QuoteImportReportView);