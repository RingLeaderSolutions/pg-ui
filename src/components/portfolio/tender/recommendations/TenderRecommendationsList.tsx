import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../../applicationState';

import Spinner from '../../../common/Spinner';
import ErrorMessage from "../../../common/ErrorMessage";
import * as moment from 'moment';

import { issueSummaryReport, fetchRecommendationsSuppliers, fetchRecommendationsSites, fetchRecommendationSummary } from '../../../../actions/tenderActions';
import { Tender, TenderSupplier, TenderRecommendation, TenderIssuance } from "../../../../model/Tender";
import { AccountDetail, PortfolioDetails } from "../../../../model/Models";
import { retrieveAccount } from "../../../../actions/portfolioActions";
import { openModalDialog } from "../../../../actions/viewActions";
import ModalDialog from "../../../common/ModalDialog";
import GenerateRecommendationDialog from "./GenerateRecommendationDialog";
import RecommendationDetailDialog from "./RecommendationDetailDialog";

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
    issueSummaryReport: (tenderId: string, summaryReportId: string) => void;
    retrieveAccount: (accountId: string) => void;
    openModalDialog: (dialogId: string) => void;
    getRecommendationSummary: (tenderId: string, summaryId: string) => void;
    getRecommendationSuppliers: (tenderId: string, summaryId: string) => void;
    getRecommendationSites: (tenderId: string, summaryId: string, siteStart: number, siteEnd: number) => void;
}

class TenderRecommendationsList extends React.Component<TenderRecommendationsListProps & StateProps & DispatchProps, {}> {
    componentDidMount(){
        this.props.retrieveAccount(this.props.portfolio.portfolio.accountId);
    }
    
    issueReport(summaryId: string){
        this.props.issueSummaryReport(this.props.tender.tenderId, summaryId);
    }

    viewRecommendationReport(recommendation: TenderRecommendation){
        this.props.getRecommendationSummary(this.props.tender.tenderId, recommendation.summaryId);
        this.props.getRecommendationSuppliers(this.props.tender.tenderId, recommendation.summaryId);
        this.props.getRecommendationSites(this.props.tender.tenderId, recommendation.summaryId, 0, recommendation.meterCount);
        this.props.openModalDialog("view_recommendation");
    }

    renderSummaryTableContent(enableIssuance: boolean){
        return this.props.tender.summaries
        .sort((q1: TenderRecommendation, q2: TenderRecommendation) => {        
            if (q1.created < q2.created) return 1;
            if (q1.created > q2.created) return -1;
            return 0;
        })
        .map(s => {
            var supplier = this.props.suppliers.find(su => su.supplierId == s.supplierId);
            var supplierText = supplier == null ? "Unknown" : supplier.name;

            var created = moment.utc(s.created).local().fromNow();   
            return (
                <tr key={s.summaryId}>
                    <td><span className="uk-label uk-label-success">{s.summaryId.substring(0, 8)}</span></td>
                    <td>{created}</td>
                    <td>{s.meterCount}</td>
                    <td>{s.supplierCount}</td>
                    <td>{supplierText}</td>
                    <td>
                        <a className="uk-button uk-button-default uk-button-small" href={s.summaryFileName}>
                            <span className="uk-margin-small-right" data-uk-icon="icon: cloud-download" />
                            Download
                        </a> 
                    </td>
                    <td>
                        <button className="uk-button uk-button-default uk-button-small" type="button" onClick={() => this.viewRecommendationReport(s)}>
                            <span className="uk-margin-small-right" data-uk-icon="icon: info" />
                            View
                        </button>   
                    </td>
                    <td>
                        <button className="uk-button uk-button-primary uk-button-small" type="button" onClick={() => this.issueReport(s.summaryId)} disabled={!enableIssuance}>
                            <span className="uk-margin-small-right" data-uk-icon="icon: mail" />
                            Issue
                        </button>   
                    </td>
                </tr>
            )
        });
    }

    renderSummaryTable(){
        var hasContact = this.props.account.contacts != null && this.props.account.contacts.length > 0;
        var warning = null;
        if(!hasContact){
            warning = (
                <div className="uk-alert-warning uk-margin-small-top uk-margin-small-bottom" data-uk-alert>
                    <p><span className="uk-margin-small-right" data-uk-icon="icon: warning" />Issuance of recommendations is disabled as this portfolio's account does not have any contacts. Please visit the Accounts tab to add a contact to this account.</p>
                </div>);
        }

        var tableContent = this.renderSummaryTableContent(hasContact);
        return (
            <div>
                {warning}
                <table className="uk-table uk-table-divider">
                    <thead>
                        <tr>
                            <th>Summary ID</th>
                            <th>Created</th>
                            <th>Meter Count</th>
                            <th>Supplier Count</th>
                            <th>Chosen Supplier</th>
                            <th></th>
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
        if(this.props.suppliers == null || this.props.working){
            return (<div className="uk-margin"><Spinner hasMargin={true} /></div>);
        }
        else if(this.props.error){
            return (<div className="uk-margin"><ErrorMessage content={this.props.errorMessage}/></div>);
        }
        else if(this.props.tender.issuances == null || this.props.tender.issuances.length == 0){
            return (<div className="uk-margin"><p>No packs have been issued for this tender yet.</p></div>);
        }

        let content;
        if(this.props.tender.summaries == null || this.props.tender.summaries.length == 0){
            content = (<p>No recommendations have been generated for this tender yet.</p>);
        }
        else {
            content = this.renderSummaryTable();
        }
        
        var packIssuance = this.getLatestPackIssuance();

        return (
            <div>
                <div className="uk-grid">
                    <div className="uk-width-expand">
                    </div>
                    <div className="uk-width-auto uk-margin-right">
                        <button className="uk-button uk-button-primary uk-button-small" type="button"onClick={() => this.props.openModalDialog("create_recommendation")}>
                            <span className="uk-margin-small-right" data-uk-icon="icon: plus" />
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
        issueSummaryReport: (tenderId: string, summaryReportId: string) => dispatch(issueSummaryReport(tenderId, summaryReportId)),
        openModalDialog: (dialogId: string) => dispatch(openModalDialog(dialogId)),
        getRecommendationSummary:  (tenderId: string, summaryId: string)  => dispatch(fetchRecommendationSummary(tenderId, summaryId)),
        getRecommendationSuppliers:  (tenderId: string, summaryId: string)  => dispatch(fetchRecommendationsSuppliers(tenderId, summaryId)),
        getRecommendationSites: (tenderId: string, summaryId: string, siteStart: number, siteEnd: number) => dispatch(fetchRecommendationsSites(tenderId, summaryId, siteStart, siteEnd))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, TenderRecommendationsListProps> = (state: ApplicationState) => {
    return {
        suppliers: state.portfolio.tender.suppliers.value,
        working: state.portfolio.tender.issue_summary.working || state.portfolio.account.working,
        error: state.portfolio.tender.issue_summary.error || state.portfolio.account.error,
        errorMessage: state.portfolio.tender.issue_summary.errorMessage || state.portfolio.account.errorMessage,
        account: state.portfolio.account.value,
        portfolio: state.portfolio.details.value
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(TenderRecommendationsList);