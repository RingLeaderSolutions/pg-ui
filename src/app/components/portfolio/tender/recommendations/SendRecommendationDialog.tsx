import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../../applicationState';
import Spinner from '../../../common/Spinner';
import ErrorMessage from "../../../common/ErrorMessage";
import * as moment from 'moment';

import { issueSummaryReport } from '../../../../actions/tenderActions';
import { closeModalDialog } from "../../../../actions/viewActions";
import { TenderRecommendation, Tender } from "../../../../model/Tender";
import { PortfolioDetails, Portfolio, User, AccountDetail } from "../../../../model/Models";
import { retrieveAccountDetail } from "../../../../actions/hierarchyActions";
import { AccountContact } from "../../../../model/HierarchyObjects";

interface SendRecommendationDialogProps {
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
    closeModalDialog: () => void;
}

interface SendRecommendationDialogState {
    availableContacts: AccountContact[];
    selectedEmails: string[];
}

class SendRecommendationDialog extends React.Component<SendRecommendationDialogProps & StateProps & DispatchProps, SendRecommendationDialogState> {
    constructor(props: SendRecommendationDialogProps & StateProps & DispatchProps){
        super(props);

        var availableContacts = this.getAvailableContacts(props.account);
        this.state = {
            availableContacts,
            selectedEmails: this.getContactEmails(availableContacts)
        }
    }

    getAvailableContacts(account: AccountDetail): AccountContact[]{
        if(account == null || account.contacts == null || account.contacts.length < 1){
            return [];
        }

        return account.contacts.filter(ac => ac.email != null && ac.email != "");
    }

    getContactEmails(contacts: AccountContact[]): string[]{
        if(contacts.length < 1){
            return [];
        }

        return contacts
            .map(ac => ac.email);
    }

    componentWillReceiveProps(props: SendRecommendationDialogProps & StateProps & DispatchProps){
        if(this.props.account == null){
            var availableContacts = this.getAvailableContacts(props.account);

            this.setState({
                availableContacts,
                selectedEmails: this.getContactEmails(availableContacts)
            })   
        }
    }

    sendRecommendation() {
        var emails = [
            ...this.state.selectedEmails,
            this.props.portfolio.salesLead.email,
            this.props.portfolio.supportExec.email
        ];

        this.props.issueSummaryReport(this.props.tender.tenderId, this.props.recommendation.summaryId, emails);
        this.props.closeModalDialog();
    }

    componentDidMount(){
        this.props.retrieveAccountDetail(this.props.portfolio_details.portfolio.accountId)
    }

    renderUser(user: User, title: string){
        return (
            <div>
                <div className="uk-card uk-card-small uk-card-default">
                    <div className="uk-card-header">
                        <h4>{title}</h4>
                    </div>
                    <div className="uk-card-body">
                        <div className="uk-grid-small" data-uk-grid>
                            <div className="uk-width-auto">
                                <img className="avatar avatar-xlarge" src={user.avatarUrl} />
                            </div>
                            <div className="uk-width-expand">
                                <p className="uk-margin-small-top">{user.firstName} {user.lastName} <i className="fas fa-envelope-open uk-margin-small-left" data-uk-tooltip={`title:${user.email}`}></i></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
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
            <div key={contact.id} className="uk-margin-small-top">
                <div className="uk-card uk-card-small uk-card-default">
                    <div className="uk-card-body" style={{padding: '10px 20px'}}>
                        <div className="uk-grid-small" data-uk-grid>
                            <div className="uk-width-auto uk-flex uk-flex-middle">
                                <input className="uk-checkbox" type="checkbox" checked={isSelected} onChange={(e) => this.toggleEmailSelection(contact.email)}/>
                            </div>
                            <div className="uk-width-expand uk-flex uk-flex-middle">
                                <p><i className="fas fa-user-circle fa-lg uk-margin-small-right"></i>{contact.firstName} {contact.lastName}{role} <i className="fas fa-envelope-open uk-margin-small-left" data-uk-tooltip={`title:${contact.email}`}></i></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>)
    }

    renderPackDialogContent(){
        var accountContacts = this.getAvailableContacts(this.props.account).map(ac => {
           return this.renderAccountContact(ac);
        })

        var warning = null;
        if(this.props.recommendation.communicated != null){
            var sent = moment.utc(this.props.recommendation.communicated).local();
            var sentDate = sent.format("dddd Do MMMM YYYY");
            var sentTime = sent.format("HH:mm");
            warning = 
                (<div className="uk-alert-warning uk-margin-small-bottom" data-uk-alert>
                    <div className="uk-grid-small" data-uk-grid>
                        <div className="uk-width-auto">
                            <i className="fas fa-exclamation-triangle uk-margin-small-right"></i>
                        </div>
                        <div className="uk-width-expand">
                            <p className="uk-text-break">This recommendation report was already sent on <strong>{sentDate}</strong> at <strong>{sentTime}</strong>.</p>    
                            <p>Are you sure you want to send it again?</p>
                        </div>
                    </div>
                </div>)
        };

        return (
            <div>
                <div className="uk-modal-body">
                    {warning}
                    <p>This recommendation report will be sent to the following users:</p>
                    
                    <div className="uk-child-width-1-2@s uk-grid-match" data-uk-grid>
                        {this.renderUser(this.props.portfolio.salesLead, "Account Manager")}
                        {this.renderUser(this.props.portfolio.supportExec, "Tender Analyst")}
                    </div>
                    {accountContacts.length > 0 ? (
                        <div className="uk-margin-medium-top">
                            <p>Please select which account contacts should also be notified: </p>
                            <div className="uk-height-max-small" style={{overflow: 'auto', padding: '5px 10px'}}>
                                {accountContacts}
                            </div>
                        </div>
                    ) : null }                    
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-right" type="button" onClick={() => this.props.closeModalDialog()}><i className="fas fa-times uk-margin-small-right"></i>Cancel</button>
                    <button className="uk-button uk-button-primary" type="button" onClick={() => this.sendRecommendation()}><i className="fas fa-envelope uk-margin-small-right"></i>Send</button>
                </div>
            </div>);
    }

    render() {
        let content;
        if(this.props.working){
            content = (<Spinner hasMargin={true} />);
        }
        else if(this.props.error){
            content = (<ErrorMessage content={this.props.errorMessage}/> )
        }
        else {
            content = this.renderPackDialogContent();
        }
        
        return (
            <div>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title"><i className="fas fa-envelope uk-margin-right" data-uk-tooltip="title:Offer"></i>Send Recommendation</h2>
                </div>
                <div>
                    {content}
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, SendRecommendationDialogProps> = (dispatch) => {
    return {
        retrieveAccountDetail: (accountId: string) => dispatch(retrieveAccountDetail(accountId)),
        issueSummaryReport: (tenderId: string, reportId: string, emails: string[]) => dispatch(issueSummaryReport(tenderId, reportId, emails)),
        closeModalDialog: () => dispatch(closeModalDialog()) 
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, SendRecommendationDialogProps> = (state: ApplicationState) => {
    return {
        portfolio_details: state.portfolio.details.value,
        portfolio: state.portfolio.selected.value,
        account: state.hierarchy.selected.value,
        working: state.hierarchy.selected.working,
        error: state.hierarchy.selected.error,
        errorMessage: state.hierarchy.selected.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(SendRecommendationDialog);