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

    renderUploadsTable(reports: UploadReport[], isImport: boolean){
        var rows = reports
            .sort(
                (a, b) => {
                    if (a.requested > b.requested) return -1;
                    if (a.requested < b.requested) return 1;
                    return 0;
                })
            .map(r => {
                var requestTime = moment.utc(r.requested).local().fromNow();   
                return (
                    <tr key={r.id}>
                        <td>{r.dataType}</td>
                        <td>{r.notes}</td>
                        <td>{requestTime}</td>
                        <td><div className="user">
                            <img className="avatar" src={r.requestor.avatarUrl} />
                            <p>{r.requestor.firstName} {r.requestor.lastName}</p>
                        </div></td>
                        <td>
                            <button className='uk-button uk-button-default uk-button-small' onClick={() => this.fetchAndDisplayReport(r.resultDocId, isImport)}><span data-uk-icon='icon: menu' data-uk-tooltip="title: Open" /></button>
                        </td>
                    </tr>
                )
            });

        return (
            <div>
                <table className="uk-table uk-table-divider">
                    <thead>
                        <tr>
                            <th>Upload type</th>
                            <th>Notes</th>
                            <th>Upload Time</th>
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
        return (
            <div className="content-inner-portfolio">
                <div className="table-uploads">
                    <div className="search-uploads">
                        <form className="uk-search uk-search-default">
                            <span data-uk-search-icon="search"></span>
                            <input className="uk-search-input" type="search" placeholder="Search..." />
                        </form>
                    </div>
                    <div>
                        <ul data-uk-tab>
                            <li><a href="#">Imports ({this.props.reports.imports.length})</a></li>
                            <li><a href="#">Uploads ({this.props.reports.uploads.length})</a></li>
                            
                        </ul>
                        <ul className="uk-switcher restrict-height-hack">
                            <li>{this.renderUploadsTable(this.props.reports.imports, true)}</li>
                            <li>{this.renderUploadsTable(this.props.reports.uploads, false)}</li>
                        </ul>
                    </div>

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