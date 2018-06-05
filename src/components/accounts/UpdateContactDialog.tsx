import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../applicationState';

import { updateContact } from '../../actions/hierarchyActions';
import { AccountContact } from "../../model/HierarchyObjects";

interface UpdateContactDialogProps {    
    contact: AccountContact;
}

interface StateProps {
}

interface DispatchProps {
    updateContact: (contact: AccountContact) => void;
}


class UpdateContactDialog extends React.Component<UpdateContactDialogProps & StateProps & DispatchProps, {}> {
    firstName: HTMLInputElement;
    lastName: HTMLInputElement;
    email: HTMLInputElement;
    phoneNumber: HTMLInputElement;
    role: HTMLInputElement;

    updateContact(){
        var contact: AccountContact = {
            id: this.props.contact.id,
            accountId: this.props.contact.accountId,
            firstName: this.firstName.value,
            lastName: this.lastName.value,
            email: this.email.value,
            phoneNumber: this.phoneNumber.value,
            role: this.role.value,
        }
        
        this.props.updateContact(contact);
    }

    render() {
        return (
            <div className="uk-modal-dialog">
                <button className="uk-modal-close-default" type="button" data-uk-close></button>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title">Update Contact: {this.props.contact.firstName} {this.props.contact.lastName}</h2>
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
                                        defaultValue={this.props.contact.firstName}
                                        ref={ref => this.firstName = ref} />
                                </div>
                                <div className='uk-margin'>
                                    <label className='uk-form-label'>Last Name</label>
                                    <input 
                                        className='uk-input' 
                                        type='text' 
                                        defaultValue={this.props.contact.lastName}
                                        ref={ref => this.lastName = ref} />
                                </div>
                                <div className='uk-margin'>
                                    <label className='uk-form-label'>Email</label>
                                    <input 
                                        className='uk-input' 
                                        type='text' 
                                        defaultValue={this.props.contact.email}
                                        ref={ref => this.email = ref} />
                                </div>
                                <div className='uk-margin'>
                                    <label className='uk-form-label'>Phone Number</label>
                                    <input 
                                        className='uk-input' 
                                        type='text' 
                                        defaultValue={this.props.contact.phoneNumber}
                                        ref={ref => this.phoneNumber = ref} />
                                </div>
                                <div className='uk-margin'>
                                    <label className='uk-form-label'>Role</label>
                                    <input 
                                        className='uk-input' 
                                        type='text' 
                                        defaultValue={this.props.contact.role}
                                        ref={ref => this.role = ref} />
                                </div>
                               
                            </fieldset>
                        </form>
                    </div>
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-right uk-modal-close" type="button">Cancel</button>
                    <button className="uk-button uk-button-primary uk-modal-close" type="button" onClick={() => this.updateContact()}>Update</button>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, UpdateContactDialogProps> = (dispatch) => {
    return {
        updateContact: (contact: AccountContact) =>  dispatch(updateContact(contact))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, UpdateContactDialogProps> = () => {
    return {};
};
  
export default connect(mapStateToProps, mapDispatchToProps)(UpdateContactDialog);