import * as React from "react";
import ErrorMessage from "../../common/ErrorMessage";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { AccountDetail } from '../../../model/Models';
import { AccountContact } from '../../../model/HierarchyObjects';
import Spinner from '../../common/Spinner';


import { deleteContact } from '../../../actions/hierarchyActions';
import CreateContactDialog, { CreateContactDialogData } from "./CreateContactDialog";
import UpdateContactDialog, { UpdateContactDialogData } from "./UpdateContactDialog";
import { openDialog } from "../../../actions/viewActions";
import { Row, Alert, Button, CardBody, Col, Card, UncontrolledTooltip } from "reactstrap";
import { LoadingIndicator } from "../../common/LoadingIndicator";
import CardHeader from "reactstrap/lib/CardHeader";
import { ModalDialogNames } from "../../common/modal/ModalDialogNames";
import { IsNullOrEmpty } from "../../../helpers/extensions/ArrayExtensions";

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
    openCreateContactDialog: (data: CreateContactDialogData) => void;
    openUpdateContactDialog: (data: UpdateContactDialogData) => void;
}

class AccountContactsView extends React.Component<AccountContactsViewProps & StateProps & DispatchProps, {}> {
    deleteContact(contactId: string){
        this.props.deleteContact(contactId);
    }

    renderContactsTable(): JSX.Element {
        return (
            <div className="d-flex flex-wrap w-100">
                {this.props.account.contacts
                        .sort(
                            (c1: AccountContact, c2: AccountContact) => {        
                                if (c1.firstName < c2.firstName) return -1;
                                if (c1.firstName > c2.firstName) return 1;
                                return 0;
                            })
                        .map((c, index) => this.renderContactCard(c, index))}
            </div>);
    }

    renderContactCard(c: AccountContact, index: number): JSX.Element {
        return (
            <Col md={6} sm={12} className="mb-4" key={c.id}>
                <Card className="card-small h-100">
                    <CardHeader className="border-bottom px-3 py-2">
                        <div className="d-flex align-items-center">
                            <div className="flex-grow-1">
                                <h6 className="m-0"><i className="fas fa-user mr-2"></i>{index + 1}</h6>
                            </div>
                            <div className="d-flex">
                                <Button color="accent" outline className="btn-grey-outline" size="sm" id={`edit-account-contact-button${c.id}`}
                                     onClick={() => this.props.openUpdateContactDialog({ contact: c})}>
                                    <i className="material-icons">mode_edit</i>
                                </Button>
                                <UncontrolledTooltip target={`edit-account-contact-button${c.id}`} placement="top">
                                    <strong>Edit Contact</strong>
                                </UncontrolledTooltip>
                                <Button color="danger" outline className="btn-grey-outline ml-2" size="sm" id={`delete-account-contact-button${c.id}`} 
                                        onClick={() => this.deleteContact}>
                                    <i className="material-icons">delete</i>
                                </Button>
                                <UncontrolledTooltip target={`delete-account-contact-button${c.id}`} placement="top">
                                    <strong>Delete Contact</strong>
                                </UncontrolledTooltip>
                            </div>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <div className="text-center">
                            <h4 className="text-capitalize"><i className="fa fa-user-circle text-accent mr-2"></i>{c.firstName} {c.lastName}</h4>
                            <p className="text-lightweight">{c.role}</p>
                        </div>
                        <div className="d-flex flex-column align-items-center">
                            <a href={`tel:${c.phoneNumber}`} className="d-block text-lightweight mb-1 text-nowrap"><i className="material-icons text-success mr-2">phone</i>{c.phoneNumber}</a>
                            <a href={`mailto:${c.email}`}className="d-block text-lightweight mb-1 text-nowrap"><i className="material-icons text-indigo mr-2">email</i>{c.email}</a>
                        </div>
                    </CardBody>
                </Card>
            </Col>);
    }

    renderNoContactsWarning(): JSX.Element {
        return (
            <Alert color="light">
                <div className="d-flex align-items-center">
                    <i className="fas fa-exclamation-triangle mr-2"></i>
                    There are no contacts associated with this account. Click on the Add Contact button above to get started.
                </div>
            </Alert>);
    }

    render() {
        if(this.props.error){
            return (<ErrorMessage content={this.props.errorMessage} />);
        }
        if(this.props.working || this.props.account == null){
            return (<LoadingIndicator />);
        }

        var hasContacts = !IsNullOrEmpty(this.props.account.contacts);

        return (
            <div className="w-100 p-3">
                <Row className="d-flex" noGutters>
                    <Button color="accent"
                            onClick={() => this.props.openCreateContactDialog({ accountId: this.props.account.id})}>
                        <i className="fas fa-user-plus mr-2"></i>
                        Add Contact
                    </Button>
                </Row>
                <Row noGutters className="mt-3">
                    {hasContacts ? this.renderContactsTable() : this.renderNoContactsWarning()}
                </Row>
                <CreateContactDialog />
                <UpdateContactDialog />
            </div>);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, AccountContactsViewProps> = (dispatch) => {
    return {
        deleteContact: (contactId: string) => dispatch(deleteContact(contactId)),
        openCreateContactDialog: (data: CreateContactDialogData) => dispatch(openDialog(ModalDialogNames.CreateAccountContact, data)),
        openUpdateContactDialog: (data: UpdateContactDialogData) => dispatch(openDialog(ModalDialogNames.UpdateAccountContact, data))
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