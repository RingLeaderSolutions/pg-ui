import * as React from "react";
import ErrorMessage from "../../common/ErrorMessage";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { AccountDetail, AccountDocument } from '../../../model/Models';
import Spinner from '../../common/Spinner';
import * as moment from 'moment';


import { fetchAccountDocumentation } from '../../../actions/hierarchyActions';
import UploadAccountDocumentDialog from "./UploadAccountDocumentDialog";
import { openModalDialog } from "../../../actions/viewActions";
import ModalDialog from "../../common/ModalDialog";

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
    openModalDialog: (dialogId: string) => void;
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
            var expiry = moment.utc(d.expiry).local().format("DD/MM/YYYY");     
            return (
                <tr key={d.id}>
                    <td>{d.documentType == "loa" ? <p>Letter of Authority</p> : <p>Other</p>}</td>
                    <td>{received}</td>
                    <td>{expiry}</td>
                    <td>
                        <a className="uk-button uk-button-default uk-button-small borderless-button" href={d.blobFileName}>
                            <i className="fas fa-download"></i>
                        </a> 
                    </td>
                </tr>
            )
        })
    }

    renderDocumentsTable(){
        return (
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
            </table>)
    }

    renderNoDocumentsWarning(){
        return (
            <div className="uk-alert-default uk-margin-right uk-alert" data-uk-alert>
                <div className="uk-grid uk-grid-small" data-uk-grid>
                    <div className="uk-width-auto uk-flex uk-flex-middle">
                        <i className="fas fa-info-circle uk-margin-small-right"></i>
                    </div>
                    <div className="uk-width-expand uk-flex uk-flex-middle">
                        <p>No documents have yet been uploaded and associated with this account. Click on the button above to get started.</p>    
                    </div>
                </div>
            </div>)
    }

    render() {
        if(this.props.error){
            return (<ErrorMessage content={this.props.errorMessage} />);
        }
        if(this.props.working || this.props.account == null){
            return (<Spinner />);
        }

        var hasDocumentation = this.props.documentation != null && this.props.documentation.length > 0;
        return (
            <div>
                <p className="uk-text-right">
                    <button className='uk-button uk-button-primary uk-margin-small-right' onClick={() => this.props.openModalDialog('upload_account_document')}><i className="fa fa-file-upload uk-margin-small-right"></i> Upload Document</button>
                </p>
                <hr />
                {hasDocumentation ? this.renderDocumentsTable() : this.renderNoDocumentsWarning()}

                <ModalDialog dialogId="upload_account_document">
                    <UploadAccountDocumentDialog accountId={this.props.account.id} />
                </ModalDialog>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, AccountDocumentsViewProps> = (dispatch) => {
    return {
        fetchAccountDocumentation: (accountId: string) => dispatch(fetchAccountDocumentation(accountId)),
        openModalDialog: (dialogId: string) => dispatch(openModalDialog(dialogId))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, AccountDocumentsViewProps, ApplicationState> = (state: ApplicationState) => {
    return {
        documentation: state.hierarchy.selected_documentation.value,
        working: state.hierarchy.selected_documentation.working,
        error: state.hierarchy.selected_documentation.error,
        errorMessage: state.hierarchy.selected_documentation.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(AccountDocumentsView);