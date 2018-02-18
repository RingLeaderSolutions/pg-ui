import * as React from "react";
import { Portfolio, PortfolioDetails, UtilityType } from '../../../model/Models';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';

import Spinner from '../../common/Spinner';
import ErrorMessage from "../../common/ErrorMessage";
import * as moment from 'moment';
import DatePicker from 'react-datepicker';

import TenderBackingSheetsDialog from './TenderBackingSheetsDialog';
import TenderQuoteSummariesDialog from './TenderQuoteSummariesDialog';
import QuoteCollateralDialog from './QuoteCollateralDialog';

import { fetchQuoteBackingSheets } from '../../../actions/tenderActions';
import { Tender, BackingSheet, TenderSupplier, TenderQuote } from "../../../model/Tender";
import { format } from 'currency-formatter';
import GenerateSummaryReportDialog from "./GenerateSummaryReportDialog";

interface TenderQuotesViewProps {
    tender: Tender;
}

interface StateProps {
    suppliers: TenderSupplier[];
    working: boolean;
}
  
interface DispatchProps {
    fetchQuoteBackingSheets: (tenderId: string, quoteId: string) => void;
}

class TenderQuotesView extends React.Component<TenderQuotesViewProps & StateProps & DispatchProps, {}> {

    fetchBackingSheets(quoteId: string){
        this.props.fetchQuoteBackingSheets(this.props.tender.tenderId, quoteId);
    }

    renderQuotesTable(viewBackingSheetClass: string){
        let quotesBySupplier = this.props.tender.quotes.reduce((r: any, a: TenderQuote) => {
            r[a.supplierId] = r[a.supplierId] || [];
            r[a.supplierId].push(a);
            return r;
        }, Object.create(null));

        let tableContent = Object.keys(quotesBySupplier).map((q: any) => {
            var highestVersion = quotesBySupplier[q].reduce((previous: TenderQuote, current: TenderQuote) => {
                return (previous.version > current.version) ? previous : current;
            });

            var supplier = this.props.suppliers.find(su => su.supplierId == highestVersion.supplierId);
            var supplierText = supplier == null ? "Unknown" : supplier.name;
            var billingAccuracy = supplier == null || supplier.serviceRatings.length == 0 ? "Unknown" : supplier.serviceRatings[0].score;
            var serviceDesk = supplier == null || supplier.serviceRatings.length == 0 ? "Unknown" : supplier.serviceRatings[1].score;

            var collateralDialogName = `modal-view-collateral-${highestVersion.quoteId}`;
            var viewCollateralDialogClass = `target: #${collateralDialogName}`;

            return (
                <tr key={highestVersion.quoteId}>
                    <td>{supplierText}</td>
                    <td><span className="uk-label uk-label-success">{highestVersion.quoteId.substring(0, 8)}</span></td>
                    <td>{highestVersion.version}</td>
                    <td>
                        <button className="uk-button uk-button-default uk-button-small" type="button" data-uk-toggle={viewBackingSheetClass} onClick={() => this.fetchBackingSheets(highestVersion.quoteId)}>
                            View
                        </button>
                    </td>
                    <td>
                        <div>
                            <button className="uk-button uk-button-default uk-button-small" type="button" data-uk-toggle={viewCollateralDialogClass}>
                                View
                            </button>
                            <div id={collateralDialogName} data-uk-modal="center: true">
                                <QuoteCollateralDialog collateral={highestVersion.collateralList} />
                            </div>
                        </div>
                    </td>
                    <td>{highestVersion.sheetCount}</td>
                    <td>{format(highestVersion.totalIncCCL, { locale: 'en-GB'})}</td>
                    <td>{billingAccuracy}</td>
                    <td>{serviceDesk}</td>
                </tr>
            );
        });
        return (
            <table className="uk-table uk-table-divider">
            <thead>
                <tr>
                    <th>Supplier</th>
                    <th>Quote Id</th>
                    <th>Version</th>
                    <th>Contract Rates</th>
                    <th>Collateral</th>
                    <th>Sheet count</th>
                    <th>Contract Value</th>
                    <th>Billing Accuracy</th>
                    <th>Service Desk</th>
                </tr>
            </thead>
            <tbody>
                {tableContent}
            </tbody>
        </table>
        )
    }
    render() {
        if(this.props.working){
            return (<Spinner hasMargin={true} />)
        }
        let { quotes, tenderId } = this.props.tender;
        var hasQuotes = quotes != null && quotes.length > 0;

        var viewQuoteBackingSheetName = `modal-view-quote-backing-${tenderId}`;
        var showQuoteBackingSheetClass = `target: #${viewQuoteBackingSheetName}`;

        var viewSummariesName = `modal-view-summaries-${tenderId}`;
        var viewSummariesClass = `target: #${viewSummariesName}`;

        var generateSummaryName = `modal-generate-summary-${tenderId}`;
        var generateSummaryClass = `target: #${generateSummaryName}`;
        return (
                <div className="uk-card uk-card-default uk-card-body">
                    <div className="uk-grid" data-uk-grid>
                        <div className="uk-width-expand@s">
                            <h3>Quotes</h3>
                        </div>
                        <div className="uk-width-1-4">
                            <button className="uk-button uk-button-default uk-button-small uk-align-right" type="button" data-uk-toggle={viewSummariesClass}>
                                <span className="uk-margin-small-right" data-uk-icon="icon: settings" />
                                Summary Reports
                            </button>
                        </div>
                        <div className="uk-width-1-4">
                            <button className="uk-button uk-button-primary uk-button-small uk-align-right" type="button" data-uk-toggle={generateSummaryClass}>
                                <span className="uk-margin-small-right" data-uk-icon="icon: bolt" />
                                Generate new summary report
                            </button>   
                        </div>
                    </div>
                <div>
                    {hasQuotes ? (this.renderQuotesTable(showQuoteBackingSheetClass)) : (<p>This tender has not yet been issued.</p>)}
                </div>
                <div id={viewQuoteBackingSheetName} data-uk-modal="center: true">
                    <TenderBackingSheetsDialog />
                </div>

                <div id={viewSummariesName} data-uk-modal="center: true">
                    <TenderQuoteSummariesDialog tender={this.props.tender} />
                </div>

                <div id={generateSummaryName} data-uk-modal="center: true">
                    <GenerateSummaryReportDialog tender={this.props.tender} />
                </div>
            </div>
        )
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, TenderQuotesViewProps> = (dispatch) => {
    return {
        fetchQuoteBackingSheets: (tenderId: string, quoteId: string) => dispatch(fetchQuoteBackingSheets(tenderId, quoteId))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, TenderQuotesViewProps> = (state: ApplicationState) => {
    return {
        suppliers: state.portfolio.tender.suppliers.value,
        working: state.portfolio.tender.suppliers.working
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(TenderQuotesView);