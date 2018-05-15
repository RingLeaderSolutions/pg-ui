import * as React from "react";
import Header from "../common/Header";
import ErrorMessage from "../common/ErrorMessage";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../applicationState';
import { Account } from '../../model/Models';
import Spinner from '../common/Spinner';
import { FormEvent } from "react";
import * as moment from 'moment';
import DatePicker from 'react-datepicker';

import { createContact } from '../../actions/hierarchyActions';
import { AccountContact } from "../../model/HierarchyObjects";

interface CreateContactDialogProps {    
    accountId: string;
}

interface StateProps {
}

interface DispatchProps {
    createContact: (contact: AccountContact) => void;
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
    }

    render() {
        return (
            <div className="uk-modal-dialog">
                <button className="uk-modal-close-default" type="button" data-uk-close></button>
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
                    <button className="uk-button uk-button-default uk-margin-right uk-modal-close" type="button">Cancel</button>
                    <button className="uk-button uk-button-primary uk-modal-close" type="button" onClick={() => this.createContact()}>Create</button>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, CreateContactDialogProps> = (dispatch) => {
    return {
        createContact: (contact: AccountContact) =>  dispatch(createContact(contact))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, CreateContactDialogProps> = (state: ApplicationState) => {
    return {
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(CreateContactDialog);