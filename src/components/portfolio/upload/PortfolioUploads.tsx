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
}

class PortfolioUploads extends React.Component<PortfolioUploadProps & StateProps & DispatchProps, {}> {
    constructor() {
        super();
    }

    componentDidMount(){
        let portfolioId = this.props.portfolio.id;     
        this.props.fetchPortfolioUploads(portfolioId);
    }

    fetchUploadReport(reportId: string, isImport: boolean){
        this.props.fetchUploadReport(reportId, isImport);
    }

    renderUploadsTable(reports: UploadReport[], isImport: boolean){
        var viewClass = isImport ? "target: #modal-view-import" : "target: #modal-view-portfolio-upload";
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
                            <button className='uk-button uk-button-default uk-button-small' data-uk-toggle={viewClass} onClick={() => this.fetchUploadReport(r.resultDocId, isImport)}><span data-uk-icon='icon: menu' data-uk-tooltip="title: Open" /></button>
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
                            <li><a href="#">Uploads</a></li>
                            <li><a href="#">Imports</a></li>
                        </ul>
                        <ul className="uk-switcher restrict-height-hack">
                            <li>{this.renderUploadsTable(this.props.reports.uploads, false)}</li>
                            <li>{this.renderUploadsTable(this.props.reports.imports, true)}</li>
                        </ul>
                    </div>
                    <div id="modal-view-portfolio-upload" data-uk-modal="center: true">
                        <UploadReportView />
                    </div>

                    <div id="modal-view-import" data-uk-modal="center: true">
                        <QuoteImportReportView />
                    </div>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, PortfolioUploadProps> = (dispatch) => {
    return {
        fetchPortfolioUploads: (portfolioId: string) => dispatch(fetchPortfolioUploads(portfolioId)),
        fetchUploadReport: (reportId: string, isImport: boolean) => dispatch(fetchUploadReport(reportId, isImport))
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