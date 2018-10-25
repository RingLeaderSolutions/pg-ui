import * as React from "react";
import { MapDispatchToPropsFunction } from 'react-redux';

import { createContact } from '../../../actions/hierarchyActions';
import { AccountContact } from "../../../model/HierarchyObjects";
import { Strings } from "../../../helpers/Utils";
import asModalDialog, { ModalDialogProps } from "../../common/modal/AsModalDialog";
import { ModalHeader, ModalBody, Form, FormGroup, Label, Input, ModalFooter, Button } from "reactstrap";
import { ModalDialogNames } from "../../common/modal/ModalDialogNames";

export interface CreateContactDialogData {
    accountId: string;   
}

interface CreateContactDialogProps extends ModalDialogProps<CreateContactDialogData> { }

interface DispatchProps {
    createContact: (contact: AccountContact) => void;
}

interface CreateAccountDialogState {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: string;
}

class CreateContactDialog extends React.Component<CreateContactDialogProps & DispatchProps, CreateAccountDialogState> {
    constructor(props: CreateContactDialogProps & DispatchProps){
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
            accountId: this.props.data.accountId,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            phoneNumber: this.state.phoneNumber,
            role: this.state.role,
        }
        
        this.props.createContact(contact);
        this.props.toggle();
    }

    handleFormChange(attribute: string, event: React.ChangeEvent<any>){
        var value = event.target.value;

        this.setState({
            ...this.state,
            [attribute]: value
        })
    }

    canSubmit(){
        return Strings.AreNotNullOrEmpty(
            this.state.firstName,
            this.state.lastName,
            this.state.email,
            this.state.phoneNumber);
    }
    
    render() {
        return (
            <div className="modal-content">
                <ModalHeader toggle={this.props.toggle}><i className="fas fa-user-plus mr-2"></i>Add Contact</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="new-contact-firstname">First Name</Label>
                            <Input id="new-contact-firstname"
                                    value={this.state.firstName}
                                    onChange={(e) => this.handleFormChange("firstName", e)} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="new-contact-lastname">Last Name</Label>
                            <Input id="new-contact-lastname"
                                    value={this.state.lastName}
                                    onChange={(e) => this.handleFormChange("lastName", e)} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="new-contact-email">Email</Label>
                            <Input id="new-contact-email"
                                    value={this.state.email}
                                    onChange={(e) => this.handleFormChange("email", e)} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="new-contact-phone">Phone</Label>
                            <Input id="new-contact-phone"
                                    value={this.state.phoneNumber}
                                    onChange={(e) => this.handleFormChange("phoneNumber", e)} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="new-contact-role">Role</Label>
                            <Input id="new-contact-role"
                                    value={this.state.role}
                                    onChange={(e) => this.handleFormChange("role", e)} />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={this.props.toggle}>
                        <i className="fas fa-times mr-1"></i>Cancel
                    </Button>
                    <Button color="accent" 
                            disabled={!this.canSubmit()}
                            onClick={() => this.createContact()}>
                        <i className="fas fa-user-plus mr-1"></i>Save
                    </Button>
                </ModalFooter>
            </div>);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, CreateContactDialogProps> = (dispatch) => {
    return {
        createContact: (contact: AccountContact) =>  dispatch(createContact(contact))
    };
};

export default asModalDialog<CreateContactDialogProps, {}, DispatchProps>(
{ 
    name: ModalDialogNames.CreateAccountContact, 
    centered: true, 
    backdrop: true,
}, null, mapDispatchToProps)(CreateContactDialog)