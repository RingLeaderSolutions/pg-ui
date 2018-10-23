import * as React from "react";
import { MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import * as cn from "classnames";
import { ImportReportDetail } from "../../../model/Models";
import { TemplateResult, FieldAction } from "../../../model/Uploads";
import ErrorMessage from "../../common/ErrorMessage";
import asModalDialog, { ModalDialogProps } from "../../common/modal/AsModalDialog";
import { ModalDialogNames } from "../../common/modal/ModalDialogNames";
import { LoadingIndicator } from "../../common/LoadingIndicator";
import ModalFooter from "reactstrap/lib/ModalFooter";
import { Button, ModalHeader, Navbar, Nav, NavItem, NavLink, ModalBody, UncontrolledTooltip } from "reactstrap";
import { IsNullOrEmpty } from "../../../helpers/extensions/ArrayExtensions";

interface RatesImportReportDialogProps extends ModalDialogProps { }

interface StateProps {
    working: boolean;
    error: boolean;
    errorMessage: string;
    uploadReport: ImportReportDetail;
}
  
interface RatesImportDialogState {
    selectedTabIndex: number;
}

class RatesImportReportDialog extends React.Component<RatesImportReportDialogProps & StateProps, RatesImportDialogState> {
    constructor(props: RatesImportReportDialogProps & StateProps) {
        super(props);
        this.state = {
            selectedTabIndex: 0
        }
    }

    selectTab(tabIndex: number){
        this.setState({
            ...this.state,
            selectedTabIndex: tabIndex
        });
    }

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
            <table className="table">
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
            <table className="table">
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
            <table className="table">
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
        let { uploadReport } = this.props;
        if(this.props.working || uploadReport == null || uploadReport.templateResults == null){
            return (<LoadingIndicator />);
        }
        if(this.props.error || uploadReport.templateResults.IsEmpty()){
            return (<ErrorMessage content="Sorry! We've encountered an error loading the import report for this. Please contact support."/>);
        }

        let template = uploadReport.templateResults[0];

        return (
            <div className="modal-content">
                <ModalHeader>Quote Import: {template.type}</ModalHeader>
                <Navbar className="p-0 bg-white">
                    <Nav tabs className="justify-content-center flex-grow-1">
                        <NavItem>
                            <NavLink className={cn({ active: this.state.selectedTabIndex === 0})}
                                    onClick={() => this.selectTab(0)}
                                    href="#">
                                Import Results
                            </NavLink>
                        </NavItem>
                        {!IsNullOrEmpty(template.unmappedColumns) && (
                        <NavItem>
                            <NavLink className={cn({ active: this.state.selectedTabIndex === 1}, "ml-2")}
                                        onClick={() => this.selectTab(1)}
                                        href="#">
                                Unmapped Columns ({template.unmappedColumns.length})
                            </NavLink>
                        </NavItem>)}
                        {!IsNullOrEmpty(uploadReport.fieldValidationErrorsList) && (<NavItem>
                            <NavLink className={cn({ active: this.state.selectedTabIndex === 2}, "ml-2")}
                                        onClick={() => this.selectTab(2)}
                                        href="#">
                                Validation Errors ({uploadReport.fieldValidationErrorsList.length})
                            </NavLink>
                        </NavItem>)}
                    </Nav>
                </Navbar>
                <ModalBody className="p-0">
                    {uploadReport.originalFileNameURI && (
                    <div className="text-right py-2 pr-2">
                        <Button color="accent" href={uploadReport.originalFileNameURI} id="download-rates-import-report-button">
                            <i className="fas fa-cloud-download-alt mr-1"></i> Download
                        </Button>
                        <UncontrolledTooltip target="download-rates-import-report-button" placement="bottom">
                            {uploadReport.originalFileName}
                        </UncontrolledTooltip>
                    </div>)}
                    {this.state.selectedTabIndex === 0 && this.renderImportResultsTable(template)}
                    {this.state.selectedTabIndex === 1 && this.renderUnmappedColumnsTable(template)}
                    {this.state.selectedTabIndex === 2 && this.renderValidationErrors(uploadReport)}
                </ModalBody>
                <ModalFooter>
                    <Button onClick={this.props.toggle}>
                        <i className="fas fa-times mr-1"></i>Close
                    </Button>
                </ModalFooter>
            </div>);
    }
}
  
const mapStateToProps: MapStateToProps<StateProps, RatesImportReportDialogProps, ApplicationState> = (state: ApplicationState) => {
    return {
        uploadReport: state.selected_upload_report.value as ImportReportDetail,
        working: state.selected_upload_report.working,
        error: state.selected_upload_report.error,
        errorMessage: state.selected_upload_report.errorMessage
    };
};

export default asModalDialog(
{ 
    name: ModalDialogNames.RatesImportReport, 
    centered: true, 
    backdrop: true,
    size: "lg"
}, mapStateToProps, null)(RatesImportReportDialog)