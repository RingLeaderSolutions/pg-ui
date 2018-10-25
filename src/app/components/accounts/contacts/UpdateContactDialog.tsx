import * as React from "react";
import { MapDispatchToPropsFunction } from 'react-redux';

import { updateContact } from '../../../actions/hierarchyActions';
import { AccountContact } from "../../../model/HierarchyObjects";
import { Strings } from "../../../helpers/Utils";
import { FormGroup, ModalHeader, ModalBody, Form, Label, Input, ModalFooter, Button } from "reactstrap";
import AsModalDialog, { ModalDialogProps } from "../../common/modal/AsModalDialog";
import { ModalDialogNames } from "../../common/modal/ModalDialogNames";

export interface UpdateContactDialogData {
    contact: AccountContact;
}

interface DispatchProps {
    updateContact: (contact: AccountContact) => void;
}

interface UpdateContactDialogState {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: string;
}

class UpdateContactDialog extends React.Component<ModalDialogProps<UpdateContactDialogData> & DispatchProps, UpdateContactDialogState> {
    constructor(props: ModalDialogProps<UpdateContactDialogData> & DispatchProps){
        super(props);
        var { contact } = props.data;
        this.state = {
            firstName: contact.firstName,
            lastName: contact.lastName,
            email: contact.email,
            phoneNumber: contact.phoneNumber,
            role: contact.role
        };
    }

    updateContact(){
        var contact: AccountContact = {
            id: this.props.data.contact.id,
            accountId: this.props.data.contact.accountId,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            phoneNumber: this.state.phoneNumber,
            role: this.state.role,
        }
        
        this.props.updateContact(contact);
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
                <ModalHeader toggle={this.props.toggle}><i className="fas fa-user-edit mr-2"></i>Update Contact: {this.props.data.contact.firstName} {this.props.data.contact.lastName}</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="update-contact-firstname">First Name</Label>
                            <Input id="update-contact-firstname"
                                    value={this.state.firstName}
                                    onChange={(e) => this.handleFormChange("firstName", e)} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="update-contact-lastname">Last Name</Label>
                            <Input id="update-contact-lastname"
                                    value={this.state.lastName}
                                    onChange={(e) => this.handleFormChange("lastName", e)} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="update-contact-email">Email</Label>
                            <Input id="update-contact-email"
                                    value={this.state.email}
                                    onChange={(e) => this.handleFormChange("email", e)} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="update-contact-phone">Phone</Label>
                            <Input id="update-contact-phone"
                                    value={this.state.phoneNumber}
                                    onChange={(e) => this.handleFormChange("phoneNumber", e)} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="update-contact-role">Role</Label>
                            <Input id="update-contact-role"
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
                            onClick={() => this.updateContact()}>
                        <i className="fas fa-user-edit mr-1"></i>Save
                    </Button>
                </ModalFooter>
            </div>);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => {
    return {
        updateContact: (contact: AccountContact) =>  dispatch(updateContact(contact))
    };
};

export default AsModalDialog<UpdateContactDialogData, {}, DispatchProps>(
{ 
    name: ModalDialogNames.UpdateAccountContact, 
    centered: true, 
    backdrop: true,
}, null, mapDispatchToProps)(UpdateContactDialog)