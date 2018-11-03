import * as React from "react";
import ErrorMessage from "./ErrorMessage";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../applicationState';
import { UploadReportsResponse } from '../../model/Models';
import * as moment from 'moment';

import { fetchPortfolioUploads, fetchUploadReport } from '../../actions/portfolioActions';
import UploadReportDialog from "./UploadReportDialog";
import RatesImportReportDialog from "../portfolio/upload/RatesImportReportDialog";
import { Card, CardHeader, CardBody, Table, Button, Nav, NavItem, NavLink, Alert } from "reactstrap";
import * as cn from "classnames";
import { UncontrolledTooltip } from "reactstrap/lib/Uncontrolled";
import { ModalDialogNames } from "./modal/ModalDialogNames";
import { openDialog } from "../../actions/viewActions";
import { LoadingIndicator } from "./LoadingIndicator";
import { fetchAccountUploads } from "../../actions/hierarchyActions";
import AlertDialog, { AlertDialogData } from "./modal/AlertDialog";

interface UploadsCardProps {
    entityId: string;
    entity: "portfolio" | "account";
}

interface StateProps {
  portfolio_reports: UploadReportsResponse;
  account_reports: UploadReportsResponse;
  working: boolean;
  error: boolean;
  errorMessage: string;
}

interface DispatchProps {
    fetchPortfolioUploads: (portfolioId: string) => void;
    fetchAccountUploads: (accountId: string) => void;
    fetchUploadReport: (reportId: string) => void;

    openRatesImportReportDialog: () => void;
    openUploadReportDialog: () => void;
    openAlertDialog: (data: AlertDialogData) => void;
}

interface PortfolioUploadsState {
    selectedTab: "tender" | "account";
}

class UploadsCard extends React.Component<UploadsCardProps & StateProps & DispatchProps, PortfolioUploadsState> {
    constructor(props: UploadsCardProps & StateProps & DispatchProps) {
        super(props);
        this.state = {
            selectedTab: "tender"
        }
    }

    componentDidMount(){
        let { entity, entityId } = this.props;
        if(entity == "portfolio") {
            this.props.fetchPortfolioUploads(entityId);
        }
        else {
            this.props.fetchAccountUploads(entityId);
        }
    }

    openAlertError(): void {
        this.props.openAlertDialog({
            body: "Sorry, there appears to be a problem with this upload report. Please get in touch with the TPI Flow support team.",
            title: "Error"
        });
    }

    fetchAndDisplayReport(uri: string, uploadType: string){
        if(!uri || uri.IsWhitespace()){
            this.openAlertError();
            return;
        }
        
        this.props.fetchUploadReport(uri);
        switch(uploadType){
            case "SUPPLYDATA":
            case "HISTORICAL":
                this.props.openUploadReportDialog();
                break;

            case "CONTRACT":
            case "QUOTE":
                this.props.openRatesImportReportDialog();
                break;

            default:
                this.openAlertError();
        }
    }

    friendlyDataType(type: string){
        {/* TODO: Reinstate tooltip? */}
        switch(type){
            case "QUOTE":
                return (<p><i className="fas fa-handshake mr-2"></i></p>);
            case "HISTORICAL":
                return (<p><i className="fas fa-clock mr-2"></i></p>)
            default:
                return (<p>{type}</p>)
        }
    }

    selectTab(selectedTab: "tender" | "account"){
        this.setState({
            selectedTab
        });
    }

    renderUploadsTable(reports: UploadReportsResponse){
        var rows = reports.uploads
            .sort(
                (a, b) => {
                    if (a.requested > b.requested) return -1;
                    if (a.requested < b.requested) return 1;
                    return 0;
                })
            .map(r => {
                var localRequested = moment.utc(r.requested).local();
                var requestTime = localRequested.fromNow();
                var detailedRequestTime = localRequested.format("DD/MM/YYYY HH:mm:ss");
                return (
                    <tr key={r.id}>
                        <td>{this.friendlyDataType(r.dataType)}</td>
                        <td>{r.notes == null || r.notes == "" ? (<i>None</i>) : r.notes}</td>
                        <td>
                            <p id={`portfolio-uploads-upload-time-${r.id}`}>{requestTime}</p>
                            <UncontrolledTooltip target={`portfolio-uploads-upload-time-${r.id}`} placement="bottom" autohide={false}>
                                <strong>{detailedRequestTime}</strong>
                            </UncontrolledTooltip>
                        </td>
                        <td>
                            <div className="d-flex">
                                <img className="user-avatar rounded-circle mr-2" src={r.requestor.avatarUrl} style={{height: '30px'}}/>
                                <p className="flex-grow-1 m-0"><span className="align-middle">{r.requestor.firstName} {r.requestor.lastName}</span></p>
                            </div>
                        </td>
                        <td>
                            <Button color="white" className="mx-auto"
                                    onClick={() => this.fetchAndDisplayReport(r.uploadReportBlobURI, r.dataType)}>
                                <i className="far fa-eye"></i>
                            </Button>
                        </td>
                    </tr>
                )
            });

        return (
            <div style={{maxHeight: "400px", overflowY: "auto"}}>
                <Table>
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Notes</th>
                            <th>Uploaded</th>
                            <th>Requester</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </Table>
            </div>);
    }

    render() {
        if(this.props.error){
            return (<ErrorMessage content={this.props.errorMessage} />);
        }
        let reports = this.props.entity == "account" ? this.props.account_reports : this.props.portfolio_reports;
        if(this.props.working || !reports){
            return (<LoadingIndicator />);
        }

        var hasUploads = reports.uploads.length > 0;
        var content = (
            <Alert color="light">
                <div className="d-flex align-items-center">
                    <i className="fas fa-info-circle mr-2"></i>
                    There haven't been any uploads for this {this.props.entity} yet.
                </div>
            </Alert>);

        if(hasUploads){
            content = this.renderUploadsTable(reports);
        }
       
        return (
            <Card className="card-small h-100">
                <CardHeader className="border-bottom">
                    <h6 className="m-0"><i className="fas fa-file-upload mr-1"></i>Uploads</h6>
                </CardHeader>
                <CardBody className="d-flex p-0">
                    {content}
                </CardBody>
                <RatesImportReportDialog />
                <UploadReportDialog />
                <AlertDialog />
            </Card>);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, UploadsCardProps> = (dispatch) => {
    return {
        fetchPortfolioUploads: (portfolioId: string) => dispatch(fetchPortfolioUploads(portfolioId)),
        fetchAccountUploads: (accountId: string) => dispatch(fetchAccountUploads(accountId)),
        fetchUploadReport: (uri: string) => dispatch(fetchUploadReport(uri)),
        
        openRatesImportReportDialog: () => dispatch(openDialog(ModalDialogNames.RatesImportReport)),
        openUploadReportDialog: () => dispatch(openDialog(ModalDialogNames.UploadReport)),
        openAlertDialog: (data: AlertDialogData) => dispatch(openDialog(ModalDialogNames.Alert, data))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, UploadsCardProps, ApplicationState> = (state: ApplicationState) => {
    return {
        portfolio_reports:state.portfolio.uploads.value,
        account_reports: state.hierarchy.selected_uploads.value,
        working: state.portfolio.uploads.working || state.hierarchy.selected_uploads.working,
        error: state.portfolio.uploads.error || state.hierarchy.selected_uploads.error,
        errorMessage: state.portfolio.uploads.errorMessage || state.hierarchy.selected_uploads.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(UploadsCard);