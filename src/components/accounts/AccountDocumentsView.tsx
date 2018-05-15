import * as React from "react";
import Header from "../common/Header";
import ErrorMessage from "../common/ErrorMessage";
import { RouteComponentProps } from 'react-router';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../applicationState';
import { Portfolio, AccountDetail, SiteDetail, HierarchyMpan, HierarchyMprn, UtilityType, AccountDocument } from '../../model/Models';
import Spinner from '../common/Spinner';
import * as moment from 'moment';


import { fetchAccountDocumentation } from '../../actions/hierarchyActions';
import UploadSupplyDataDialog from "../portfolio/mpan/UploadSupplyDataDialog";
import UpdateAccountDialog from "./UpdateAccountDialog";
import UploadAccountDocumentDialog from "./UploadAccountDocumentDialog";

interface AccountDocumentsViewProps {
    account: AccountDetail;
}

interface StateProps {
  documentation: AccountDocument[];
  working: boolean;
  error: boolean;
  errorMessage: string;
}

interface DispatchProps {
    fetchAccountDocumentation: (accountId: string) => void;
}

class AccountDocumentsView extends React.Component<AccountDocumentsViewProps & StateProps & DispatchProps, {}> {

    componentDidMount(){
        this.props.fetchAccountDocumentation(this.props.account.id);
    }

    renderDocumentationRows(){

        if(this.props.documentation == null || this.props.documentation.length == 0){
            return (<tr><td colSpan={4}>No documents have been uploaded yet.</td></tr>);
        }

        return this.props.documentation.map(d => {
            var received = moment.utc(d.received).local().fromNow();     
            var expiry = moment.utc(d.expiry).local().format('L');     
            return (
                <tr key={d.id}>
                    <td>{d.documentType}</td>
                    <td>{received}</td>
                    <td>{expiry}</td>
                    <td>
                        <a className="uk-button uk-button-default uk-button-small" href={d.blobFileName}>
                            <span data-uk-icon="icon: cloud-download" />
                        </a> 
                    </td>
                </tr>
            )
        })
    }

    render() {
        if(this.props.error){
            return (<ErrorMessage content={this.props.errorMessage} />);
        }
        if(this.props.working || this.props.account == null){
            return (<Spinner />);
        }
        var selectedAccount = this.props.account;
        return (
            <div>
                <p className="uk-text-right">
                    <button className='uk-button uk-button-primary uk-button-small uk-margin-small-right' data-uk-toggle="target: #modal-upload-document"><span data-uk-icon='icon: upload' /> Upload Document</button>
                </p>
                <table className="uk-table uk-table-divider">
                    <thead>
                        <tr>
                            <th>Document Type</th>
                            <th>Uploaded</th>
                            <th>Expiry</th>
                            <th>Download</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderDocumentationRows()}
                    </tbody>
                </table>

                <div id="modal-upload-document" data-uk-modal="center: true">
                    <UploadAccountDocumentDialog accountId={this.props.account.id} />
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, AccountDocumentsViewProps> = (dispatch) => {
    return {
        fetchAccountDocumentation: (accountId: string) => dispatch(fetchAccountDocumentation(accountId))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, AccountDocumentsViewProps> = (state: ApplicationState) => {
    return {
        documentation: state.hierarchy.selected_documentation.value,
        working: state.hierarchy.selected_documentation.working,
        error: state.hierarchy.selected_documentation.error,
        errorMessage: state.hierarchy.selected_documentation.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(AccountDocumentsView);