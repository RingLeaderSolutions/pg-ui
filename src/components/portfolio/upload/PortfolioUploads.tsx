import * as React from "react";
import ErrorMessage from "../../common/ErrorMessage";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { UploadReport, Portfolio, UploadReportsResponse } from '../../../model/Models';
import Spinner from '../../common/Spinner';
import * as moment from 'moment';

import { fetchPortfolioUploads, fetchUploadReport } from '../../../actions/portfolioActions';
import UploadReportView from "../../common/UploadReportView";
import QuoteImportReportView from "./QuoteImportReportView";
import { openModalDialog } from "../../../actions/viewActions";
import ModalDialog from "../../common/ModalDialog";
import { UtilityIcon } from "../../common/UtilityIcon";

interface PortfolioUploadProps {
    portfolio: Portfolio;
}

interface StateProps {
  reports: UploadReportsResponse;
  working: boolean;
  error: boolean;
  errorMessage: string;
}

interface DispatchProps {
    fetchPortfolioUploads: (portfolioId: string) => void;
    fetchUploadReport: (reportId: string, isImport: boolean) => void;
    openModalDialog: (dialogId: string) => void;
}

class PortfolioUploads extends React.Component<PortfolioUploadProps & StateProps & DispatchProps, {}> {
    componentDidMount(){
        let portfolioId = this.props.portfolio.id;     
        this.props.fetchPortfolioUploads(portfolioId);
    }

    fetchAndDisplayReport(reportId: string, isImport: boolean){
        var dialogName = isImport ? "view_portfolio_import" : "view_portfolio_upload";

        this.props.fetchUploadReport(reportId, isImport);
        this.props.openModalDialog(dialogName)
    }

    friendlyDataType(type: string){
        switch(type){
            case "QUOTE":
                return (<p><i className="fas fa-handshake uk-margin-small-right fa-lg" data-uk-tooltip="title:Offer"></i></p>);
            case "HISTORICAL":
                return (<p><i className="fas fa-clock uk-margin-small-right fa-lg" data-uk-tooltip="title:Electricity Historical Data"></i></p>)
            default:
                return (<p>{type}</p>)
        }
    }

    renderUploadsTable(reports: UploadReport[], isImport: boolean){
        var rows = reports
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
                        <td><p data-uk-tooltip={`title:${detailedRequestTime}`}>{requestTime}</p></td>
                        <td><div className="user">
                            <img className="avatar" src={r.requestor.avatarUrl} />
                            <p>{r.requestor.firstName} {r.requestor.lastName}</p>
                        </div></td>
                        <td>
                            <button className='uk-button uk-button-default uk-button-small' onClick={() => this.fetchAndDisplayReport(r.resultDocId, isImport)}><i className="far fa-eye" data-uk-tooltip="title: View"></i></button>
                        </td>
                    </tr>
                )
            });

        return (
            <div>
                <table className="uk-table uk-table-divider">
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
                </table>
                
            </div>
        )
    }

    render() {
        if(this.props.error){
            return (<ErrorMessage content={this.props.errorMessage} />);
        }
        if(this.props.working || this.props.reports == null){
            return (<Spinner />);
        }

        var hasTenderDataUploads = this.props.reports.imports.length > 0;
        var hasAccountDataUploads = this.props.reports.uploads.length > 0;
        var hasAnyUploads = hasTenderDataUploads || hasAccountDataUploads;

        var content = (
            <div className="uk-alert-default uk-margin-small-top uk-margin-small-bottom uk-text-center" data-uk-alert>
                <p><i className="fas fa-info-circle uk-margin-small-right"></i>There haven't been any uploads for this portfolio yet.</p>
            </div>);
        if(hasTenderDataUploads && hasAccountDataUploads){
            content = (
                <div>
                    <ul className="uk-tab" data-uk-switcher="connect: +.uk-switcher">
                        <li><a href="#">Tender Data ({this.props.reports.imports.length})</a></li>
                        <li><a href="#">Account Data ({this.props.reports.uploads.length})</a></li>
                    </ul>
                    <ul className="uk-switcher">
                        <li>{this.renderUploadsTable(this.props.reports.imports, true)}</li>
                        <li>{this.renderUploadsTable(this.props.reports.uploads, false)}</li>
                    </ul>
                </div>);
        }
        else if(hasAnyUploads) {
            content = hasTenderDataUploads ? 
                this.renderUploadsTable(this.props.reports.imports, true) : 
                this.renderUploadsTable(this.props.reports.uploads, false);
        }

        return (
            <div className="content-inner-portfolio">
                <div className="table-uploads">
                    {content}

                    <ModalDialog dialogId="view_portfolio_upload" dialogClass="upload-report-modal">
                        <UploadReportView />
                    </ModalDialog>

                    <ModalDialog dialogId="view_portfolio_import" dialogClass="upload-report-modal">
                        <QuoteImportReportView />
                    </ModalDialog>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, PortfolioUploadProps> = (dispatch) => {
    return {
        fetchPortfolioUploads: (portfolioId: string) => dispatch(fetchPortfolioUploads(portfolioId)),
        fetchUploadReport: (reportId: string, isImport: boolean) => dispatch(fetchUploadReport(reportId, isImport)),
        openModalDialog: (dialogId: string) => dispatch(openModalDialog(dialogId))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, PortfolioUploadProps> = (state: ApplicationState) => {
    return {
        reports: state.portfolio.uploads.value,
        working: state.portfolio.uploads.working,
        error: state.portfolio.uploads.error,
        errorMessage: state.portfolio.uploads.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(PortfolioUploads);