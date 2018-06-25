import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';

import { createContact } from '../../actions/hierarchyActions';
import { AccountContact } from "../../model/HierarchyObjects";
import { closeModalDialog } from "../../actions/viewActions";

interface CreateContactDialogProps {    
    accountId: string;
}

interface StateProps {
}

interface DispatchProps {
    createContact: (contact: AccountContact) => void;
    closeModalDialog: () => void;
}


class CreateContactDialog extends React.Component<CreateContactDialogProps & StateProps & DispatchProps, {}> {
    firstName: HTMLInputElement;
    lastName: HTMLInputElement;
    email: HTMLInputElement;
    phoneNumber: HTMLInputElement;
    role: HTMLInputElement;

    createContact(){
        var contact: AccountContact = {
            id: "",
            accountId: this.props.accountId,
            firstName: this.firstName.value,
            lastName: this.lastName.value,
            email: this.email.value,
            phoneNumber: this.phoneNumber.value,
            role: this.role.value,
        }
        
        this.props.createContact(contact);
        this.props.closeModalDialog();
    }

    render() {
        return (
            <div>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title">Create Contact</h2>
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
                                        ref={ref => this.firstName = ref} />
                                </div>
                                <div className='uk-margin'>
                                    <label className='uk-form-label'>Last Name</label>
                                    <input 
                                        className='uk-input' 
                                        type='text' 
                                        ref={ref => this.lastName = ref} />
                                </div>
                                <div className='uk-margin'>
                                    <label className='uk-form-label'>Email</label>
                                    <input 
                                        className='uk-input' 
                                        type='text' 
                                        ref={ref => this.email = ref} />
                                </div>
                                <div className='uk-margin'>
                                    <label className='uk-form-label'>Phone Number</label>
                                    <input 
                                        className='uk-input' 
                                        type='text' 
                                        ref={ref => this.phoneNumber = ref} />
                                </div>
                                <div className='uk-margin'>
                                    <label className='uk-form-label'>Role</label>
                                    <input 
                                        className='uk-input' 
                                        type='text' 
                                        ref={ref => this.role = ref} />
                                </div>
                               
                            </fieldset>
                        </form>
                    </div>
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-right" type="button" onClick={() => this.props.closeModalDialog()}>Cancel</button>
                    <button className="uk-button uk-button-primary" type="button" onClick={() => this.createContact()}>Create</button>
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