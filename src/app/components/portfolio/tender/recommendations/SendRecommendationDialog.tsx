import * as React from "react";
import { MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../../applicationState';
import ErrorMessage from "../../../common/ErrorMessage";
import * as moment from 'moment';
import * as cn from 'classnames';

import { issueSummaryReport } from '../../../../actions/tenderActions';
import { TenderRecommendation, Tender } from "../../../../model/Tender";
import { PortfolioDetails, Portfolio, User, AccountDetail } from "../../../../model/Models";
import { retrieveAccountDetail } from "../../../../actions/hierarchyActions";
import { AccountContact } from "../../../../model/HierarchyObjects";
import { ModalDialogNames } from "../../../common/modal/ModalDialogNames";
import AsModalDialog, { ModalDialogProps } from "../../../common/modal/AsModalDialog";
import { LoadingIndicator } from "../../../common/LoadingIndicator";
import ModalHeader from "reactstrap/lib/ModalHeader";
import ModalBody from "reactstrap/lib/ModalBody";
import ModalFooter from "reactstrap/lib/ModalFooter";
import Button from "reactstrap/lib/Button";
import { Row, Card, Col, CustomInput, Alert } from "reactstrap";
import CardHeader from "reactstrap/lib/CardHeader";
import CardBody from "reactstrap/lib/CardBody";
import { UncontrolledTooltip } from "reactstrap/lib/Uncontrolled";
import { IsNullOrEmpty } from "../../../../helpers/extensions/ArrayExtensions";

export interface SendRecommendationDialogData {
    tender: Tender;
    recommendation: TenderRecommendation;
}

interface StateProps {
    working: boolean;
    error: boolean;
    errorMessage: string;
    account: AccountDetail;
    portfolio: Portfolio;
    portfolio_details: PortfolioDetails;
}
  
interface DispatchProps {
    retrieveAccountDetail: (accountId: string) => void;
    issueSummaryReport: (tenderId: string, summaryId: string, emails: string[]) => void;
}

interface SendRecommendationDialogState {
    availableContacts: AccountContact[];
    selectedEmails: string[];
}

class SendRecommendationDialog extends React.Component<ModalDialogProps<SendRecommendationDialogData>  & StateProps & DispatchProps, SendRecommendationDialogState> {
    constructor(props: ModalDialogProps<SendRecommendationDialogData>  & StateProps & DispatchProps){
        super(props);

        this.renderAccountContact = this.renderAccountContact.bind(this);

        let availableContacts = this.getAvailableContacts(props.account);
        this.state = {
            availableContacts,
            selectedEmails: this.getContactEmails(availableContacts)
        }
    }

    getAvailableContacts(account: AccountDetail): AccountContact[]{
        if(account == null || IsNullOrEmpty(account.contacts)){
            return [];
        }

        return account.contacts.filter(ac => ac.email != null && ac.email != "");
    }

    getContactEmails(contacts: AccountContact[]): string[]{
        if(IsNullOrEmpty(contacts)){
            return [];
        }

        return contacts
            .map(ac => ac.email);
    }

    sendRecommendation() {
        var emails = [
            ...this.state.selectedEmails,
            this.props.portfolio.salesLead.email,
            this.props.portfolio.supportExec.email
        ];

        this.props.issueSummaryReport(this.props.data.tender.tenderId, this.props.data.recommendation.summaryId, emails);
        this.props.toggle();
    }

    componentDidMount(){
        this.props.retrieveAccountDetail(this.props.portfolio_details.portfolio.accountId)
    }

    renderAlreadySentWarning(communicated: string) : JSX.Element {
        let sent = moment.utc(communicated).local();
        let sentDate = sent.format("dddd Do MMMM YYYY");
        let sentTime = sent.format("HH:mm");
        return (
            <Alert color="warning">
                <div className="text-center text-dark">
                    <i className="fas fa-exclamation-triangle my-1 d-block"></i>
                    <p className="mb-0">This recommendation report was already sent on <strong>{sentDate}</strong> at <strong>{sentTime}</strong>.</p>    
                    <p className="mt-1 mb-0">Are you sure you want to send it again?</p>
                </div>
            </Alert>);
    }
    
    renderUser(user: User, title: string, pad?: boolean){
        return (
            <Col xs={6} className={cn({ "pl-1" : pad, "pr-1" : !pad })}>
                <Card className="card-small">
                    <CardHeader className="border-bottom"><h6 className="text-center mb-0">{title}</h6></CardHeader>
                    <CardBody style={{padding: "1rem"}}>
                        <div className="d-flex align-items-center flex-nowrap">
                            <img className="user-avatar rounded-circle mr-2" src={user.avatarUrl} style={{height: '45px'}}/>
                            <h6 className="flex-grow-1 m-0 text-truncate">
                                <span className="text-midweight" id={`user-email-${user.id}-${title.charAt(0)}`}>{user.firstName} {user.lastName}</span>
                                <UncontrolledTooltip target={`user-email-${user.id}-${title.charAt(0)}`} autohide={false}>
                                    {user.email}
                                </UncontrolledTooltip>
                            </h6>
                        </div>
                    </CardBody>
                </Card>
            </Col>);
    }

    toggleEmailSelection(email: string){
        if(this.state.selectedEmails.find(selectedEmail => selectedEmail == email)){
            this.setState( {
                selectedEmails: this.state.selectedEmails.filter((selectedEmail) => selectedEmail != email)
            })
        }
        else {
            this.setState({
                selectedEmails: [...this.state.selectedEmails, email]
            })
        }
    }

    renderAccountContact(contact: AccountContact){
        var isSelected = this.state.selectedEmails.find(email => email == contact.email) != null;
        var role = contact.role != "" ? ` (${contact.role}) ` : "";

        return (
            <Card className="card-small" key={contact.id}>
                <CardBody className="d-flex align-items-center">
                    <CustomInput type="checkbox"
                                    id={`check-${contact.id}`}
                                    checked={isSelected} 
                                    onChange={(e) => this.toggleEmailSelection(contact.email)}
                                    label={`${contact.firstName} ${contact.lastName}${role}`}
                                    inline/>
                    <i className="far fa-envelope ml-1" id={`contact-email-${contact.id}`}></i>
                    <UncontrolledTooltip target={`contact-email-${contact.id}`} autohide={false}>
                        {contact.email}
                    </UncontrolledTooltip>
                </CardBody>
            </Card>);
    }

    render() {
        if(this.props.working){
            return (<LoadingIndicator />);
        }
        else if(this.props.error){
            return (<ErrorMessage content={this.props.errorMessage}/> )
        }

        let accountContacts = this.getAvailableContacts(this.props.account)
            .map(this.renderAccountContact);

        let { communicated } = this.props.data.recommendation;

        return (
            <div className="modal-content">
                <ModalHeader toggle={this.props.toggle}><i className="material-icons mr-2">send</i>Send Recommendation</ModalHeader>
                <ModalBody>
                    {communicated && this.renderAlreadySentWarning(communicated)}
                    <p className="mb-1">This recommendation report will be sent to the following users:</p>
                    
                    <Row noGutters>
                        {this.renderUser(this.props.portfolio.salesLead, "Account Manager")}
                        {this.renderUser(this.props.portfolio.supportExec, "Tender Analyst", true)}
                    </Row>
                    {accountContacts.length > 0 && (
                        <div className="mt-3">
                            <p className="mb-1">Please select which account contacts should also be notified: </p>
                            <div style={{overflow: 'visible'}}>
                                {accountContacts}
                            </div>
                        </div>
                    )}  
                </ModalBody>
                <ModalFooter>
                    <Button onClick={this.props.toggle}>
                        <i className="fas fa-times mr-1"></i>Cancel
                    </Button>
                    <Button color="accent" 
                            onClick={() => this.sendRecommendation()}>
                        <i className="material-icons mr-1">send</i>Send
                    </Button>
                </ModalFooter>
            </div>);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => {
    return {
        retrieveAccountDetail: (accountId: string) => dispatch(retrieveAccountDetail(accountId)),
        issueSummaryReport: (tenderId: string, reportId: string, emails: string[]) => dispatch(issueSummaryReport(tenderId, reportId, emails))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, {}, ApplicationState> = (state: ApplicationState) => {
    return {
        portfolio_details: state.portfolio.details.value,
        portfolio: state.portfolio.selected.value,
        account: state.hierarchy.selected.value,
        working: state.hierarchy.selected.working,
        error: state.hierarchy.selected.error,
        errorMessage: state.hierarchy.selected.errorMessage
    };
};
  
export default AsModalDialog<SendRecommendationDialogData, StateProps, DispatchProps>(
{ 
    name: ModalDialogNames.SendRecommendation, 
    centered: true, 
    backdrop: true,
    
}, mapStateToProps, mapDispatchToProps)(SendRecommendationDialog)