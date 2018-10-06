import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../../applicationState';

import Spinner from '../../../common/Spinner';
import ErrorMessage from "../../../common/ErrorMessage";
import * as moment from 'moment';

import { fetchRecommendationsSuppliers, fetchRecommendationsSites, fetchRecommendationSummary, selectRecommendationReport, acceptQuote } from '../../../../actions/tenderActions';
import { Tender, TenderSupplier, TenderRecommendation, TenderIssuance, isComplete } from "../../../../model/Tender";
import { AccountDetail, PortfolioDetails } from "../../../../model/Models";
import { retrieveAccount } from "../../../../actions/portfolioActions";
import { openModalDialog } from "../../../../actions/viewActions";
import ModalDialog from "../../../common/ModalDialog";
import GenerateRecommendationDialog from "./GenerateRecommendationDialog";
import RecommendationDetailDialog from "./RecommendationDetailDialog";
import SendRecommendationDialog from "./SendRecommendationDialog";
import { TenderCompleteWarning } from "../warnings/TenderCompleteWarning";

interface TenderRecommendationsListProps {
    tender: Tender;
}

interface StateProps {
    working: boolean;
    error: boolean;
    errorMessage: string;
    suppliers: TenderSupplier[];
    account: AccountDetail;
    portfolio: PortfolioDetails;
}
  
interface DispatchProps {
    retrieveAccount: (accountId: string) => void;
    openModalDialog: (dialogId: string) => void;
    getRecommendationSummary: (tenderId: string, summaryId: string) => void;
    getRecommendationSuppliers: (tenderId: string, summaryId: string) => void;
    getRecommendationSites: (tenderId: string, summaryId: string, siteStart: number, siteEnd: number) => void;
    selectRecommendationReport: (recommendation: TenderRecommendation) => void;
    acceptQuote: (tenderId: string, quoteId: string) => void;
}

class TenderRecommendationsList extends React.Component<TenderRecommendationsListProps & StateProps & DispatchProps, {}> {
    componentDidMount(){
        this.props.retrieveAccount(this.props.portfolio.portfolio.accountId);
    }

    viewRecommendationReport(recommendation: TenderRecommendation){
        this.props.getRecommendationSummary(this.props.tender.tenderId, recommendation.summaryId);
        this.props.getRecommendationSuppliers(this.props.tender.tenderId, recommendation.summaryId);

        this.props.selectRecommendationReport(recommendation);
        this.props.openModalDialog("view_recommendation");
    }


    renderRecommendationActions(recommendation: TenderRecommendation, enableAction: boolean){
        let { tenderId, winningQuoteId, summaryId } = recommendation;
        if(recommendation.communicated){
            return (
                <div className="uk-button-group">
                    <button className="uk-button uk-button-primary" disabled={!enableAction} onClick={() => this.props.acceptQuote(tenderId, winningQuoteId)}><i className="fas fa-check-circle uk-margin-small-right"></i>Accept</button>
                    <div className="uk-inline">
                        <button className="uk-button uk-button-primary dropdown-button" type="button"  disabled={!enableAction}><i className="fas fa-chevron-down"></i></button>
                        <div data-uk-dropdown="mode: click; boundary: ! .uk-button-group; boundary-align: true;">
                            <ul className="uk-nav uk-dropdown-nav">
                                <li className="uk-active"><a href="#" onClick={() => this.props.openModalDialog(`send_recommendation_${summaryId}`)}><i className="fas fa-envelope uk-margin-small-right"></i>Resend</a></li>
                            </ul>
                        </div>
                    </div>
                </div>);
        }

        return (
            <button className="uk-button uk-button-primary uk-button-small" type="button" onClick={() => this.props.openModalDialog(`send_recommendation_${summaryId}`)} disabled={!enableAction}>
                <i className="fas fa-envelope uk-margin-small-right"></i>
                Send
            </button>   
        )
    }

    renderSummaryTableContent(enableAction: boolean){
        return this.props.tender.summaries
        .sort((q1: TenderRecommendation, q2: TenderRecommendation) => {        
            if (q1.created < q2.created) return 1;
            if (q1.created > q2.created) return -1;
            return 0;
        })
        .map(s => {
            var supplier = this.props.suppliers.find(su => su.supplierId == s.supplierId);
            var supplierText = supplier == null ? "Unknown" : (<img src={supplier.logoUri} style={{ maxWidth: "70px", maxHeight: "40px"}}/>);

            var created = moment.utc(s.created).local();
            var communicated = s.communicated != null ? moment.utc(s.communicated).local().fromNow() : "Never";
            return (
                <tr key={s.summaryId} className="uk-table-middle">
                    <td>
                        <button className="uk-button uk-button-default uk-button-small" type="button" onClick={() => this.viewRecommendationReport(s)}>
                            <i className="far fa-eye fa-lg"></i>
                        </button>   
                    </td>
                    <td data-uk-tooltip={`title:${created.format("DD/MM/YYYY HH:mm:ss")}`}>{created.fromNow()}</td>
                    <td>{s.meterCount}</td>
                    <td>{s.supplierCount}</td>
                    <td>{supplierText}</td>
                    <td>{s.winningDuration == 0 ? "Flexi" : `${s.winningDuration} months`}</td>
                    <td data-uk-tooltip={s.communicated ? `title:${moment.utc(s.communicated).local().format("DD/MM/YYYY HH:mm:ss")}` : "title:This recommendation report has not yet been sent."}>{communicated}</td>
                    <td>
                        <div>
                            {this.renderRecommendationActions(s, enableAction)}
                            <ModalDialog dialogId={`send_recommendation_${s.summaryId}`}>
                                <SendRecommendationDialog tender={this.props.tender} recommendation={s} />
                            </ModalDialog>
                        </div>
                    </td>
                </tr>
            )
        });
    }

    renderSummaryTable(tenderComplete: boolean){
        var hasContact = this.props.account.contacts != null && this.props.account.contacts.length > 0;
        var warning = null;
        if(!hasContact){
            warning = (
                <div className="uk-alert-warning uk-margin-small-top uk-margin-small-bottom" data-uk-alert>
                    <p><i className="fas fa-info-circle uk-margin-small-right"></i>Issuance of recommendations is disabled as this portfolio's account does not have any contacts. Please visit the Accounts tab to add a contact to this account.</p>
                </div>);
        }

        let enableAction = !tenderComplete && hasContact;
        var tableContent = this.renderSummaryTableContent(enableAction);
        return (
            <div>
                {warning}
                <table className="uk-table uk-table-divider">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Created</th>
                            <th>Meter Count</th>
                            <th>Supplier Count</th>
                            <th>Winner</th>
                            <th></th>
                            <th>Last Sent</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableContent}
                    </tbody>
                </table>
            </div>)
    }

    getLatestPackIssuance(){
        return this.props.tender.issuances
            .sort(
                (i1: TenderIssuance, i2: TenderIssuance) => {
                    var firstDate = moment.utc(i1.created).unix();
                    var secondDate = moment.utc(i2.created).unix();
            
                    if (firstDate > secondDate) return -1;
                    if (firstDate < secondDate) return 1;
                    return 0;
                })[0];
    }

    render() {
        let { tender } = this.props;
        if(this.props.suppliers == null || this.props.working){
            return (<div className="uk-margin"><Spinner hasMargin={true} /></div>);
        }
        else if(this.props.error){
            return (<div className="uk-margin"><ErrorMessage content={this.props.errorMessage}/></div>);
        }
        else if(tender.issuances == null || tender.issuances.length == 0){
            return (
                <div className="uk-margin">
                    <div className="uk-alert-info uk-margin-small-top uk-margin-small-bottom" data-uk-alert>
                        <p><i className="fas fa-info-circle uk-margin-small-right"></i>No packs have been issued for this tender yet. Head back to the Offers tab to issue some requirements and start receiving offers.</p>
                    </div>
                </div>);
        }

        let tenderComplete = isComplete(tender);

        let content = (
            <div className="uk-margin">
                <div className="uk-alert-info uk-margin-small-top uk-margin-small-bottom" data-uk-alert>
                    <p><i className="fas fa-info-circle uk-margin-small-right"></i>No recommendations have been generated for this tender yet. Click on the button above to get started!</p>
                </div>
            </div>);
        
        if(tender.summaries && tender.summaries.length > 0){
            content = this.renderSummaryTable(tenderComplete);
        }
        
        var packIssuance = this.getLatestPackIssuance();

        return (
            <div>
                { tenderComplete && (<div className="uk-margin-bottom"><TenderCompleteWarning /></div>)}
                <div className="uk-grid">
                    <div className="uk-width-expand">
                    </div>
                    <div className="uk-width-auto uk-margin-right">
                        <button className="uk-button uk-button-primary uk-button-small" type="button"onClick={() => this.props.openModalDialog("create_recommendation")} disabled={tenderComplete}>
                            <i className="fa fa-plus-circle uk-margin-small-right fa-lg"></i>
                            Create Recommendation
                        </button>
                    </div>
                </div>
                <div className="uk-margin">
                    {content}
                </div>  
                <ModalDialog dialogId="view_recommendation" dialogClass="large-modal">
                    <RecommendationDetailDialog tender={this.props.tender} />
                </ModalDialog>
                <ModalDialog dialogId="create_recommendation">
                    <GenerateRecommendationDialog tender={this.props.tender} issuance={packIssuance} />
                </ModalDialog>
            </div>);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, TenderRecommendationsListProps> = (dispatch) => {
    return {
        retrieveAccount: (accountId: string) => dispatch(retrieveAccount(accountId)),
        openModalDialog: (dialogId: string) => dispatch(openModalDialog(dialogId)),
        getRecommendationSummary:  (tenderId: string, summaryId: string)  => dispatch(fetchRecommendationSummary(tenderId, summaryId)),
        getRecommendationSuppliers:  (tenderId: string, summaryId: string)  => dispatch(fetchRecommendationsSuppliers(tenderId, summaryId)),
        getRecommendationSites: (tenderId: string, summaryId: string, siteStart: number, siteEnd: number) => dispatch(fetchRecommendationsSites(tenderId, summaryId, siteStart, siteEnd)),
        selectRecommendationReport: (recommendation: TenderRecommendation) => dispatch(selectRecommendationReport(recommendation)),
        acceptQuote: (tenderId: string, quoteId: string) => dispatch(acceptQuote(tenderId, quoteId))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, TenderRecommendationsListProps, ApplicationState> = (state: ApplicationState) => {
    return {
        suppliers: state.suppliers.value,
        working: state.portfolio.tender.issue_summary.working || state.portfolio.account.working,
        error: state.portfolio.tender.issue_summary.error || state.portfolio.account.error,
        errorMessage: state.portfolio.tender.issue_summary.errorMessage || state.portfolio.account.errorMessage,
        account: state.portfolio.account.value,
        portfolio: state.portfolio.details.value
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(TenderRecommendationsList);