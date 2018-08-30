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
    issueSummaryReport: (tenderId: string, summaryId: string) => void;
    closeModalDialog: () => void;
}

class SendRecommendationDialog extends React.Component<SendRecommendationDialogProps & StateProps & DispatchProps, {}> {
    sendRecommendation() {
        this.props.issueSummaryReport(this.props.tender.tenderId, this.props.recommendation.summaryId);
        this.props.closeModalDialog();
    }

    componentDidMount(){
        this.props.retrieveAccountDetail(this.props.portfolio_details.portfolio.accountId)
    }

    renderUser(user: User, title: string){
        return (
            <div>
                <div className="uk-card uk-card-small uk-card-default" style={{width: "300px"}}>
                    <div className="uk-card-header">
                        <h4>{title}</h4>
                    </div>
                    <div className="uk-card-body">
                        <div className="uk-grid-small" data-uk-grid>
                            <div className="uk-width-auto">
                                <img className="avatar avatar-xlarge" src={user.avatarUrl} />
                            </div>
                            <div className="uk-width-expand">
                                <p className="uk-margin-small-top">{user.firstName} {user.lastName}</p>
                            </div>
                        </div>
                        <div className="uk-margin-small-top">
                            <p className="uk-text-meta uk-margin-small-left"><span className="icon-standard-cursor uk-margin-small-right" data-uk-icon="icon: mail" />{user.email}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    renderAccountContact(contact: AccountContact){
        var role = contact.role != "" ? ` (${contact.role}) ` : "";
        return (
            <div key={contact.id}>
                <div className="uk-card uk-card-small uk-card-default">
                    <div className="uk-card-body">
                        <div className="uk-grid-small" data-uk-grid>
                            <div className="uk-width-auto">
                                <p><span className="icon-standard-cursor uk-margin-small-right" data-uk-icon="icon: user" />{contact.firstName} {contact.lastName}{role}</p>
                            </div>
                            <div className="uk-width-expand">
                                <p className="uk-text-meta"><span className="icon-standard-cursor uk-margin-small-right" data-uk-icon="icon: mail" />{contact.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>)
    }

    renderPackDialogContent(){
        var accountContacts = this.props.account.contacts.map(ac => {
           return this.renderAccountContact(ac);
        })

        var warning = null;
        if(this.props.recommendation.communicated != null){
            var sent = moment(this.props.recommendation.communicated);
            var sentDate = sent.format("dddd Do MMMM YYYY");
            var sentTime = sent.format("HH:mm");
            warning = 
                (<div className="uk-alert-info uk-margin-small-bottom" data-uk-alert>
                    <div className="uk-grid-small" data-uk-grid>
                        <div className="uk-width-auto">
                            <span className="uk-margin-small-right" data-uk-icon="icon: info" />
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
                    <p>The following account contacts will also be notified:</p>
                    <div>
                        {accountContacts}
                    </div>
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-right" type="button" onClick={() => this.props.closeModalDialog()}>Cancel</button>
                    <button className="uk-button uk-button-primary" type="button" onClick={() => this.sendRecommendation()}><span className="uk-margin-small-right" data-uk-icon="icon: mail" />Send</button>
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
                    <h2 className="uk-modal-title">Send Recommendation</h2>
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
        issueSummaryReport: (tenderId: string, reportId: string) => dispatch(issueSummaryReport(tenderId, reportId)),
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