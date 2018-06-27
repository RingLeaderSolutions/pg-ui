import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';

import Spinner from '../../common/Spinner';
import ErrorMessage from "../../common/ErrorMessage";
import * as moment from 'moment';

import { issueSummaryReport } from '../../../actions/tenderActions';
import { Tender, TenderSupplier } from "../../../model/Tender";
import { closeModalDialog } from "../../../actions/viewActions";
import { AccountDetail, PortfolioDetails } from "../../../model/Models";
import { retrieveAccount } from "../../../actions/portfolioActions";

interface TenderQuoteSummariesDialogProps {
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
    closeModalDialog: () => void;
    retrieveAccount: (accountId: string) => void;
}

class TenderQuoteSummariesDialog extends React.Component<TenderQuoteSummariesDialogProps & StateProps & DispatchProps, {}> {
    componentDidMount(){
        this.props.retrieveAccount(this.props.portfolio.portfolio.accountId);
    }
    
    issueReport(summaryId: string){
        this.props.issueSummaryReport(this.props.tender.tenderId, summaryId);
    }

    renderSummaryTableContent(enableIssuance: boolean){
        return this.props.tender.summaries.map(s => {
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
                        <button className="uk-button uk-button-primary uk-button-small" type="button" onClick={() => this.issueReport(s.summaryId)} disabled={!enableIssuance}>
                            Issue
                        </button>   
                    </td>
                </tr>
            )
        });
    }

    renderSummaryTable(){
        if(this.props.tender.summaries == null || this.props.tender.summaries.length == 0){
            return (<p>No recomendations have been generated.</p>);
        }

        var hasContact = this.props.account.contacts != null && this.props.account.contacts.length > 0;
        var warning = null;
        if(!hasContact){
            warning = (
                <div className="uk-alert-warning uk-margin-small-top uk-margin-small-bottom" data-uk-alert>
                    <p>Issuance of reccomendations is disabled as this portfolio's account does not have any contacts. Please visit the Accounts tab to rectify this.</p>
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
    
    renderSummaryDialogContent(){
        return (
            <div>
                <div className="uk-margin">
                    {this.renderSummaryTable()}
                </div>      
            </div>);
    }

    render() {
        let content;
        if(this.props.suppliers == null || this.props.working){
            content = (<Spinner hasMargin={true} />);
        }
        else if(this.props.error){
            content = (<ErrorMessage content={this.props.errorMessage}/> )
        }
        else {
            content = this.renderSummaryDialogContent();
        }
        
        return (
            <div>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title">Recommendations</h2>
                </div>
                <div className="uk-modal-body">
                    <div className="uk-margin">
                        {content}
                    </div>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, TenderQuoteSummariesDialogProps> = (dispatch) => {
    return {
        retrieveAccount: (accountId: string) => dispatch(retrieveAccount(accountId)),
        issueSummaryReport: (tenderId: string, summaryReportId: string) => dispatch(issueSummaryReport(tenderId, summaryReportId)),
        closeModalDialog: () => dispatch(closeModalDialog())
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, TenderQuoteSummariesDialogProps> = (state: ApplicationState) => {
    return {
        suppliers: state.portfolio.tender.suppliers.value,
        working: state.portfolio.tender.issue_summary.working || state.portfolio.account.working,
        error: state.portfolio.tender.issue_summary.error || state.portfolio.account.error,
        errorMessage: state.portfolio.tender.issue_summary.errorMessage || state.portfolio.account.errorMessage,
        account: state.portfolio.account.value,
        portfolio: state.portfolio.details.value
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(TenderQuoteSummariesDialog);