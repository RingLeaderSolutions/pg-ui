import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';

import { createContact } from '../../actions/hierarchyActions';
import { AccountContact } from "../../model/HierarchyObjects";
import { closeModalDialog } from "../../actions/viewActions";
import { StringsAreNotNullOrEmpty } from "../../helpers/ValidationHelpers";

interface CreateContactDialogProps {    
    accountId: string;
}

interface StateProps {
}

interface DispatchProps {
    createContact: (contact: AccountContact) => void;
    closeModalDialog: () => void;
}

interface CreateAccountDialogState {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: string;
}

class CreateContactDialog extends React.Component<CreateContactDialogProps & StateProps & DispatchProps, CreateAccountDialogState> {
    constructor(props: CreateContactDialogProps & StateProps & DispatchProps){
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            role: ''
        };
    }

    createContact(){
        var contact: AccountContact = {
            id: "",
            accountId: this.props.accountId,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            phoneNumber: this.state.phoneNumber,
            role: this.state.role,
        }
        
        this.props.createContact(contact);
        this.props.closeModalDialog();
    }

    handleFormChange(attribute: string, event: React.ChangeEvent<any>){
        var value = event.target.value;

        this.setState({
            ...this.state,
            [attribute]: value
        })
    }

    canSubmit(){
        return StringsAreNotNullOrEmpty(
            this.state.firstName,
            this.state.lastName,
            this.state.email,
            this.state.phoneNumber);
    }
    
    render() {
        return (
            <div>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title"><i className="fas fa-user-plus uk-margin-right"></i>Add Contact</h2>
                </div>
                <div className="uk-modal-body">
                    <div className="uk-margin">
                        <form>
                            <fieldset className="uk-fieldset">
                                <div className='uk-margin'>
                                    <label className='uk-form-label'>First Name</label>
                                    <input 
                                        className='uk-input' 
                                        type='text' 
                                        value={this.state.firstName}
                                        onChange={(e) => this.handleFormChange("firstName", e)} />
                                </div>
                                <div className='uk-margin'>
                                    <label className='uk-form-label'>Last Name</label>
                                    <input 
                                        className='uk-input' 
                                        type='text' 
                                        value={this.state.lastName}
                                        onChange={(e) => this.handleFormChange("lastName", e)} />
                                </div>
                                <div className='uk-margin'>
                                    <label className='uk-form-label'>Email</label>
                                    <input 
                                        className='uk-input' 
                                        type='text' 
                                        value={this.state.email}
                                        onChange={(e) => this.handleFormChange("email", e)} />
                                </div>
                                <div className='uk-margin'>
                                    <label className='uk-form-label'>Phone Number</label>
                                    <input 
                                        className='uk-input' 
                                        type='text' 
                                        value={this.state.phoneNumber}
                                        onChange={(e) => this.handleFormChange("phoneNumber", e)} />
                                </div>
                                <div className='uk-margin'>
                                    <label className='uk-form-label'>Role</label>
                                    <input 
                                        className='uk-input' 
                                        type='text' 
                                        value={this.state.role}
                                        onChange={(e) => this.handleFormChange("role", e)} />
                                </div>
                            </fieldset>
                        </form>
                    </div>
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-right" type="button" onClick={() => this.props.closeModalDialog()}><i className="fas fa-times uk-margin-small-right"></i>Cancel</button>
                    <button className="uk-button uk-button-primary" type="button" onClick={() => this.createContact()} disabled={!this.canSubmit()}><i className="fas fa-user-plus uk-margin-small-right"></i>Create</button>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, CreateContactDialogProps> = (dispatch) => {
    return {
        createContact: (contact: AccountContact) =>  dispatch(createContact(contact)),
        closeModalDialog: () => dispatch(closeModalDialog()) 
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, CreateContactDialogProps> = () => {
    return {};
};
  
export default connect(mapStateToProps, mapDispatchToProps)(CreateContactDialog);