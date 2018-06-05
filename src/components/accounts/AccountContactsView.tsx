import * as React from "react";
import ErrorMessage from "../common/ErrorMessage";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../applicationState';
import { AccountDetail } from '../../model/Models';
import { AccountContact } from '../../model/HierarchyObjects';
import Spinner from '../common/Spinner';


import { deleteContact } from '../../actions/hierarchyActions';
import CreateContactDialog from "./CreateContactDialog";
import UpdateContactDialog from "./UpdateContactDialog";

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
}

class AccountContactsView extends React.Component<AccountContactsViewProps & StateProps & DispatchProps, {}> {

    deleteContact(contactId: string){
        this.props.deleteContact(contactId);
    }
    renderAccountContactRows(){
        if(this.props.account.contacts == null || this.props.account.contacts.length == 0){
            return (<tr><td colSpan={6}>No contacts have been added yet.</td></tr>);
        }
        
        return this.props.account.contacts
        .sort(
            (c1: AccountContact, c2: AccountContact) => {        
                if (c1.firstName < c2.firstName) return -1;
                if (c1.firstName > c2.firstName) return 1;
                return 0;
            })
        .map(c => {
            var updateContactDialogName = `modal-update-contact-${c.id}`;
            var viewUpdateContactDialogClass = `target: #${updateContactDialogName}`;

            return (
                <tr key={c.id}>
                    <td>{c.firstName}</td>
                    <td>{c.lastName}</td>
                    <td>{c.phoneNumber}</td>
                    <td>{c.email}</td>
                    <td>{c.role}</td>
                    <td>
                        <div>
                            <div className="uk-inline">
                                <button className="uk-button uk-button-default" type="button">
                                    <span data-uk-icon="icon: more" />
                                </button>
                                <div data-uk-dropdown="pos:bottom-justify;mode:click">
                                    <ul className="uk-nav uk-dropdown-nav">
                                    <li><a href="#" data-uk-toggle={viewUpdateContactDialogClass}>
                                        <span className="uk-margin-small-right" data-uk-icon="icon: pencil" />
                                        Edit
                                    </a></li>
                                    <li className="uk-nav-divider"></li>
                                    <li><a href="#" onClick={() => this.deleteContact(c.id)}>
                                        <span className="uk-margin-small-right" data-uk-icon="icon: trash" />
                                        Delete
                                    </a></li>
                                    </ul>
                                </div>
                            </div>
                            <div id={updateContactDialogName} data-uk-modal="center: true">
                                <UpdateContactDialog contact={c} />
                            </div>
                        </div>
                    </td>
                </tr>
            )
        });
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
                    <button className='uk-button uk-button-primary uk-button-small uk-margin-small-right' data-uk-toggle="target: #modal-add-contact"><span data-uk-icon='icon: plus' /> Add Contact</button>
                </p>
                <table className="uk-table uk-table-divider">
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Phone #</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderAccountContactRows()}
                    </tbody>
                </table>
                <div id="modal-add-contact" data-uk-modal="center: true">
                    <CreateContactDialog accountId={this.props.account.id} />
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, AccountContactsViewProps> = (dispatch) => {
    return {
        deleteContact: (contactId: string) => dispatch(deleteContact(contactId))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, AccountContactsViewProps> = (state: ApplicationState) => {
    return {
        account: state.hierarchy.selected.value,
        working: state.hierarchy.selected.working,
        error: state.hierarchy.selected.error,
        errorMessage: state.hierarchy.selected.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(AccountContactsView);