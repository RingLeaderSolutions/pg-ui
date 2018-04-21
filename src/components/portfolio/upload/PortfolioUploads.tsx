import * as React from "react";
import ErrorMessage from "../../common/ErrorMessage";
import { RouteComponentProps } from 'react-router';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { UploadReport, SupplyDataUploadReport, Portfolio } from '../../../model/Models';
import Spinner from '../../common/Spinner';
import * as moment from 'moment';

import { fetchPortfolioUploads, fetchUploadReport } from '../../../actions/portfolioActions';
import SupplyDataReportView from "./SupplyDataReportView";

interface PortfolioUploadProps {
    portfolio: Portfolio;
}

interface StateProps {
  reports: UploadReport[];
  working: boolean;
  error: boolean;
  errorMessage: string;
}

interface DispatchProps {
    fetchPortfolioUploads: (portfolioId: string) => void;
    fetchUploadReport: (reportId: string) => void;
}

class PortfolioUploads extends React.Component<PortfolioUploadProps & StateProps & DispatchProps, {}> {
    constructor() {
        super();
    }

    componentDidMount(){
        let portfolioId = this.props.portfolio.id;     
        this.props.fetchPortfolioUploads(portfolioId);
    }

    fetchUploadReport(reportId: string){
        this.props.fetchUploadReport(reportId);
    }

    renderUploadsTable(){
        var uploadReportDialogName = `modal-view-upload-${this.props.portfolio.id}`;
        var showUploadReportDialogClass = `target: #${uploadReportDialogName}`;

        var rows = this.props.reports.map(r => {
            var requestTime = moment.utc(r.requested).local().fromNow();   
            return (
                <tr key={r.id}>
                    <td>{r.dataType}</td>
                    <td>{r.notes}</td>
                    <td>{requestTime}</td>
                    <td>{r.requestor}</td>
                    <td>
                        <button className='uk-button uk-button-default uk-button-small' data-uk-toggle={showUploadReportDialogClass} onClick={() => this.fetchUploadReport(r.resultDocId)}><span data-uk-icon='icon: menu' data-uk-tooltip="title: Open" /></button>
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
                <div id={uploadReportDialogName} data-uk-modal="center: true">
                    <SupplyDataReportView />
                </div>
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
                        {this.renderUploadsTable()}
                    </div>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, PortfolioUploadProps> = (dispatch) => {
    return {
        fetchPortfolioUploads: (portfolioId: string) => dispatch(fetchPortfolioUploads(portfolioId)),
        fetchUploadReport: (reportId: string) => dispatch(fetchUploadReport(reportId))
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