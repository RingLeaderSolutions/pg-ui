import * as React from "react";
import ErrorMessage from "../common/ErrorMessage";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../applicationState';
import { UploadReportsResponse } from '../../model/Models';
import Spinner from '../common/Spinner';
import * as moment from 'moment';

import { fetchAccountUploads } from '../../actions/hierarchyActions';
import { fetchUploadReport } from '../../actions/portfolioActions';

import UploadReportView from "../common/UploadReportView";
import { openModalDialog } from "../../actions/viewActions";
import ModalDialog from "../common/ModalDialog";

interface AccountUploadsViewProps {
    accountId: string;
}

interface StateProps {
  reports: UploadReportsResponse;
  working: boolean;
  error: boolean;
  errorMessage: string;
}

interface DispatchProps {
    fetchAccountUploads: (accountId: string) => void;
    fetchUploadReport: (reportId: string) => void;
    openModalDialog: (dialogId: string) => void;
}

class AccountUploadsView extends React.Component<AccountUploadsViewProps & StateProps & DispatchProps, {}> {
    componentDidMount(){
        this.props.fetchAccountUploads(this.props.accountId);
    }

    fetchUploadReport(reportId: string){
        this.props.fetchUploadReport(reportId);
        this.props.openModalDialog('view_account_upload');
    }

    renderUploadRows(){
        return this.props.reports.uploads
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
                        <button className='uk-button uk-button-default uk-button-small' onClick={() => this.fetchUploadReport(r.resultDocId)}><i className="far fa-eye uk-margin-small-right"></i></button>
                    </td>
                </tr>
            )
        });
    }

    render() {
        if(this.props.error){
            return (<ErrorMessage content={this.props.errorMessage} />);
        }
        if(this.props.working || this.props.reports == null){
            return (<Spinner />);
        }

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
                        {this.renderUploadRows()}
                    </tbody>
                </table>
                <ModalDialog dialogId="view_account_upload" dialogClass="upload-report-modal">
                    <UploadReportView />
                </ModalDialog>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, AccountUploadsViewProps> = (dispatch) => {
    return {
        fetchAccountUploads: (accountId: string) => dispatch(fetchAccountUploads(accountId)),
        fetchUploadReport: (reportId: string) => dispatch(fetchUploadReport(reportId, false)),
        openModalDialog: (dialogId: string) => dispatch(openModalDialog(dialogId))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, AccountUploadsViewProps> = (state: ApplicationState) => {
    return {
        reports: state.hierarchy.selected_uploads.value,
        working: state.hierarchy.selected_uploads.working,
        error: state.hierarchy.selected_uploads.error,
        errorMessage: state.hierarchy.selected_uploads.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(AccountUploadsView);