import * as React from "react";
import { Portfolio, PortfolioDetails, UtilityType } from '../../../model/Models';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';

import Spinner from '../../common/Spinner';
import ErrorMessage from "../../common/ErrorMessage";
import * as moment from 'moment';
import DatePicker from 'react-datepicker';

import { issueSummaryReport } from '../../../actions/tenderActions';
import { Tender, TenderPack, TenderSupplier, TenderQuoteSummary } from "../../../model/Tender";

interface TenderQuoteSummariesDialogProps {
    tender: Tender;
}

interface StateProps {
    working: boolean;
    error: boolean;
    errorMessage: string;
    suppliers: TenderSupplier[];
}
  
interface DispatchProps {
    issueSummaryReport: (tenderId: string, summaryReportId: string) => void;
}

class TenderQuoteSummariesDialog extends React.Component<TenderQuoteSummariesDialogProps & StateProps & DispatchProps, {}> {
    issueReport(summaryId: string){
        this.props.issueSummaryReport(this.props.tender.tenderId, summaryId);
    }

    renderSummaryTableContent(){
        return this.props.tender.summaries.map(s => {
            var supplier = this.props.suppliers.find(su => su.supplierId == s.supplierId);
            var supplierText = supplier == null ? "Unknown" : supplier.name;

            return (
                <tr key={s.summaryId}>
                    <td><span className="uk-label uk-label-success">{s.summaryId.substring(0, 8)}</span></td>
                    <td>{s.created}</td>
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
                        <button className="uk-button uk-button-primary" type="button" onClick={() => this.issueReport(s.summaryId)}>
                            Issue
                        </button>   
                    </td>
                </tr>
            )
        });
    }

    renderSummaryTable(){
        if(this.props.tender.summaries == null || this.props.tender.summaries.length == 0){
            return (<p>No reccomendations have been generated.</p>);
        }

        var tableContent = this.renderSummaryTableContent();
        return (
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
            </table>)
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
        let { tender } = this.props;
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
            <div className="uk-modal-dialog summary-report-dialog">
                <button className="uk-modal-close-default" type="button" data-uk-close></button>
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
        issueSummaryReport: (tenderId: string, summaryReportId: string) => dispatch(issueSummaryReport(tenderId, summaryReportId))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, TenderQuoteSummariesDialogProps> = (state: ApplicationState) => {
    return {
        suppliers: state.portfolio.tender.suppliers.value,
        working: state.portfolio.tender.issue_summary.working,
        error: state.portfolio.tender.issue_summary.error,
        errorMessage: state.portfolio.tender.issue_summary.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(TenderQuoteSummariesDialog);