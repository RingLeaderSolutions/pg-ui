import * as React from "react";
import ErrorMessage from "../../common/ErrorMessage";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { AccountDetail } from '../../../model/Models';
import { AccountContact } from '../../../model/HierarchyObjects';
import Spinner from '../../common/Spinner';


import { deleteContact } from '../../../actions/hierarchyActions';
import CreateContactDialog from "./CreateContactDialog";
import UpdateContactDialog from "./UpdateContactDialog";
import { openModalDialog } from "../../../actions/viewActions";
import ModalDialog from "../../common/ModalDialog";

interface AccountContactsViewProps {
}

interface StateProps {
  account: AccountDetail;
  working: boolean;
  error: boolean;
  errorMessage: string;
}

interface DispatchProps {
    deleteContact: (contactId: string) => void;
    openModalDialog: (dialogId: string) => void;
}

class AccountContactsView extends React.Component<AccountContactsViewProps & StateProps & DispatchProps, {}> {
    deleteContact(contactId: string){
        this.props.deleteContact(contactId);
    }

    renderAccountContactRows(){
        return this.props.account.contacts
        .sort(
            (c1: AccountContact, c2: AccountContact) => {        
                if (c1.firstName < c2.firstName) return -1;
                if (c1.firstName > c2.firstName) return 1;
                return 0;
            })
        .map(c => {
            var updateContactDialogName = `update_contact_${c.id}`;

            return (
                <tr key={c.id} className="uk-table-middle">
                    <td style={{padding: '0px'}}><i className="fa fa-user-circle fa-lg"></i></td>
                    <td>{c.firstName}</td>
                    <td>{c.lastName}</td>
                    <td>{c.phoneNumber}</td>
                    <td>{c.email}</td>
                    <td>{c.role}</td>
                    <td>
                        <div>
                            <div className="uk-inline">
                                <button className="uk-button uk-button-default borderless-button" type="button">
                                    <i className="fa fa-ellipsis-v"></i>
                                </button>
                                <div data-uk-dropdown="pos:bottom-justify;mode:click">
                                    <ul className="uk-nav uk-dropdown-nav">
                                    <li><a href="#" onClick={() => this.props.openModalDialog(updateContactDialogName)}>
                                        <i className="far fa-edit uk-margin-small-right"></i>
                                        Edit
                                    </a></li>
                                    <li className="uk-nav-divider"></li>
                                    <li><a href="#" onClick={() => this.deleteContact(c.id)}>
                                        <i className="far fa-trash-alt uk-margin-small-right"></i>
                                        Delete
                                    </a></li>
                                    </ul>
                                </div>
                            </div>
                            <ModalDialog dialogId={updateContactDialogName}>
                                <UpdateContactDialog contact={c} />
                            </ModalDialog>
                        </div>
                    </td>
                </tr>
            )
        });
    }

    renderContactsTable(){
        return (
            <table className="uk-table uk-table-divider">
                <thead>
                    <tr>
                        <th></th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Phone #</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderAccountContactRows()}
                </tbody>
            </table>
        )
    }

    renderNoContactsWarning(){
        return (
            <div className="uk-alert-default uk-margin-right uk-alert" data-uk-alert>
                <div className="uk-grid uk-grid-small" data-uk-grid>
                    <div className="uk-width-auto uk-flex uk-flex-middle">
                        <i className="fas fa-info-circle uk-margin-small-right"></i>
                    </div>
                    <div className="uk-width-expand uk-flex uk-flex-middle">
                        <p>There are no contacts associated with this account. Click on the button above to get started.</p>    
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

        var hasContacts = this.props.account.contacts != null && this.props.account.contacts.length > 0;
        return (
            <div>
                <p className="uk-text-right">
                    <button className='uk-button uk-button-primary uk-margin-small-right' onClick={() => this.props.openModalDialog('create-contact')}><i className="fas fa-user-plus uk-margin-small-right"></i> Add Contact</button>
                </p>
                <hr />
                {hasContacts ? this.renderContactsTable() : this.renderNoContactsWarning()}
                
                <ModalDialog dialogId="create-contact">
                    <CreateContactDialog accountId={this.props.account.id} />
                </ModalDialog>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, AccountContactsViewProps> = (dispatch) => {
    return {
        deleteContact: (contactId: string) => dispatch(deleteContact(contactId)),
        openModalDialog: (dialogId: string) => dispatch(openModalDialog(dialogId))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, AccountContactsViewProps, ApplicationState> = (state: ApplicationState) => {
    return {
        account: state.hierarchy.selected.value,
        working: state.hierarchy.selected.working,
        error: state.hierarchy.selected.error,
        errorMessage: state.hierarchy.selected.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(AccountContactsView);