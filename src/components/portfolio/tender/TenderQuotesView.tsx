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

import { fetchQuoteBackingSheets, exportContractRates } from '../../../actions/tenderActions';
import { Tender, BackingSheet, TenderSupplier, TenderQuote, TenderIssuance, TenderPack } from "../../../model/Tender";
import { format } from 'currency-formatter';
import GenerateSummaryReportDialog from "./GenerateSummaryReportDialog";
import UploadOfferDialog from "./UploadOfferDialog";
import IssueTenderPackDialog from "./IssueTenderPackDialog";
import TenderPackDialog from "./TenderPackDialog";

interface TenderQuotesViewProps {
    tender: Tender;
}

interface StateProps {
    suppliers: TenderSupplier[];
    working: boolean;
}
  
interface DispatchProps {
    fetchQuoteBackingSheets: (tenderId: string, quoteId: string) => void;
    exportContractRates: (tenderId: string, quoteId: string) => void
}

class TenderQuotesView extends React.Component<TenderQuotesViewProps & StateProps & DispatchProps, {}> {

    fetchBackingSheets(quoteId: string){
        this.props.fetchQuoteBackingSheets(this.props.tender.tenderId, quoteId);
    }

    exportQuote(quoteId: string){
        this.props.exportContractRates(this.props.tender.tenderId, quoteId);
    }
    // renderQuotesTable(viewBackingSheetClass: string){
    //     let quotesBySupplier = this.props.tender.quotes.reduce((r: any, a: TenderQuote) => {
    //         r[a.supplierId] = r[a.supplierId] || [];
    //         r[a.supplierId].push(a);
    //         return r;
    //     }, Object.create(null));

    //     let tableContent = Object.keys(quotesBySupplier).map((q: any, index: number) => {
    //         var highestVersion = quotesBySupplier[q].reduce((previous: TenderQuote, current: TenderQuote) => {
    //             return (previous.version > current.version) ? previous : current;
    //         });

    //         var supplier = this.props.suppliers.find(su => su.supplierId == highestVersion.supplierId);
    //         var supplierText = supplier == null ? "Unknown" : supplier.name;
    //         var billingAccuracy = supplier == null || supplier.serviceRatings.length == 0 ? "Unknown" : supplier.serviceRatings[0].score;
    //         var serviceDesk = supplier == null || supplier.serviceRatings.length == 0 ? "Unknown" : supplier.serviceRatings[1].score;

    //         var collateralDialogName = `modal-view-collateral-${highestVersion.quoteId}`;
    //         var viewCollateralDialogClass = `target: #${collateralDialogName}`;

    //         var isPending = highestVersion.status == "PENDING";

    //         return (
    //             <tr key={index}>
    //                 <td>{supplierText}</td>
    //                 <td>{isPending ? (<span className="uk-label uk-label-warning"><i>Pending</i></span>) : (<span className="uk-label uk-label-success">{highestVersion.quoteId.substring(0, 8)}</span>)}</td>  
    //                 <td>{!isPending ? highestVersion.version: (<p>N/A</p>)}</td>
    //                 <td>
    //                     {!isPending ? 
    //                         (<button className="uk-button uk-button-default uk-button-small" type="button" data-uk-toggle={viewBackingSheetClass} onClick={() => this.fetchBackingSheets(highestVersion.quoteId)}>
    //                             View
    //                         </button>) : (<p>-</p>)}
                        
    //                 </td>
    //                 <td>
    //                     {!isPending ? 
    //                     (<div>
    //                         <button className="uk-button uk-button-default uk-button-small" type="button" data-uk-toggle={viewCollateralDialogClass}>
    //                             View
    //                         </button>
    //                         <div id={collateralDialogName} data-uk-modal="center: true">
    //                             <QuoteCollateralDialog collateral={highestVersion.collateralList} />
    //                         </div>
    //                     </div>) : (<p>-</p>)}
    //                 </td>
    //                 <td>{!isPending ? (highestVersion.sheetCount) : (<p>-</p>)}</td>
    //                 <td>{!isPending ? format(highestVersion.totalIncCCL, { locale: 'en-GB'}) : (<p>-</p>)}</td>
    //                 <td>{billingAccuracy}</td>
    //                 <td>{serviceDesk}</td>
    //                 <td>
    //                     {!isPending ? 
    //                     (<button className="uk-button uk-button-default uk-button-small" type="button" data-uk-tooltip="title: Download" onClick={() => this.exportQuote(highestVersion.quoteId)}>
    //                         <span data-uk-icon="icon: cloud-download" />
    //                     </button>) 
    //                     : null}
    //                 </td>
    //             </tr>
    //         );
    //     });
    //     return (
    //         <table className="uk-table uk-table-divider">
    //         <thead>
    //             <tr>
    //                 <th>Supplier</th>
    //                 <th>Quote Id</th>
    //                 <th>Version</th>
    //                 <th>Contract Rates</th>
    //                 <th>Collateral</th>
    //                 <th>Site count</th>
    //                 <th>Contract Value</th>
    //                 <th>Billing Accuracy</th>
    //                 <th>Service Desk</th>
    //             </tr>
    //         </thead>
    //         <tbody>
    //             {tableContent}
    //         </tbody>
    //     </table>
    //     )
    // }
    // render() {
    //     if(this.props.working){
    //         return (<Spinner hasMargin={true} />)
    //     }
    //     let { quotes, tenderId } = this.props.tender;
    //     var hasQuotes = quotes != null && quotes.length > 0;

    //     var viewQuoteBackingSheetName = `modal-view-quote-backing-${tenderId}`;
    //     var showQuoteBackingSheetClass = `target: #${viewQuoteBackingSheetName}`;

    //     var viewSummariesName = `modal-view-summaries-${tenderId}`;
    //     var viewSummariesClass = `target: #${viewSummariesName}`;

    //     var generateSummaryName = `modal-generate-summary-${tenderId}`;
    //     var generateSummaryClass = `target: #${generateSummaryName}`;

    //     var uploadOfferName = `modal-upload-offer-${tenderId}`;
    //     var uploadOfferClass = `target: #${uploadOfferName}`;
    //     return (
    //             <div className="uk-card uk-card-small uk-card-default uk-card-body">
    //                 <div className="uk-grid" data-uk-grid>
    //                     <div className="uk-width-expand@s">
    //                         <h3>Offers</h3>
    //                     </div>
    //                     <div className="uk-width-1-3">
    //                         <button className="uk-button uk-button-default uk-button-small uk-align-right" type="button" data-uk-toggle={uploadOfferClass}>
    //                             <span className="uk-margin-small-right" data-uk-icon="icon: cloud-upload" />
    //                             Upload Offer
    //                         </button>
    //                     </div>
    //                 </div>
    //                 <div>
    //                     {hasQuotes ? (this.renderQuotesTable(showQuoteBackingSheetClass)) : (<p>This tender has not yet been issued.</p>)}
    //                 </div>
    //                 { hasQuotes ? 
    //                     <div className="uk-width-2-3 uk-grid" data-uk-grid>
    //                         <div className="uk-width-1-2">
    //                             <button className="uk-button uk-button-default uk-button-small uk-align-right" type="button" data-uk-toggle={viewSummariesClass}>
    //                                 <span className="uk-margin-small-right" data-uk-icon="icon: settings" />
    //                                 Summary Reports
    //                             </button>
    //                         </div>
    //                         <div className="uk-width-1-2">
    //                             <button className="uk-button uk-button-primary uk-button-small uk-align-right" type="button" data-uk-toggle={generateSummaryClass}>
    //                                 <span className="uk-margin-small-right" data-uk-icon="icon: bolt" />
    //                                 Generate new summary report
    //                             </button>   
    //                         </div>
    //                     </div> : null}
    //                 <div id={viewQuoteBackingSheetName} data-uk-modal="center: true">
    //                     <TenderBackingSheetsDialog />
    //                 </div>

    //                 <div id={viewSummariesName} data-uk-modal="center: true">
    //                     <TenderQuoteSummariesDialog tender={this.props.tender} />
    //                 </div>

    //                 <div id={generateSummaryName} data-uk-modal="center: true">
    //                     <GenerateSummaryReportDialog tender={this.props.tender} />
    //                 </div>

    //                 <div id={uploadOfferName} data-uk-modal="center: true">
    //                     <UploadOfferDialog tenderId={this.props.tender.tenderId} />
    //                 </div>
    //         </div>
    //     )
    // }
    renderOffersTable(packs: TenderPack[]){
        var quotes = packs.map((p, index) => {
            var highestVersion = p.quotes.reduce((previous: TenderQuote, current: TenderQuote) => {
                return (previous.version > current.version) ? previous : current;
            });

            var supplier = this.props.suppliers.find(su => su.supplierId == highestVersion.supplierId);
            var supplierText = supplier == null ? "Unknown" : supplier.name;
            var billingAccuracy = supplier == null || supplier.serviceRatings.length == 0 ? "Unknown" : supplier.serviceRatings[0].score;
            var serviceDesk = supplier == null || supplier.serviceRatings.length == 0 ? "Unknown" : supplier.serviceRatings[1].score;

            var viewBackingSheetClass = `target: #modal-view-quote-bs-${this.props.tender.tenderId}`;
            var collateralDialogName = `modal-view-collateral-${highestVersion.quoteId}`;
            var viewCollateralDialogClass = `target: #${collateralDialogName}`;

            var isPending = highestVersion.status == "PENDING";

            return (
                <tr key={index}>
                    <td><img src={supplier.logoUri} style={{ width: "70px"}}/></td>
                    <td>{isPending ? (<span className="uk-label uk-label-warning"><i>Pending</i></span>) : (<span className="uk-label uk-label-success">{highestVersion.quoteId.substring(0, 8)}</span>)}</td>  
                    <td>{!isPending ? highestVersion.version: (<p>N/A</p>)}</td>
                    <td>
                        {!isPending ? 
                            (<button className="uk-button uk-button-default uk-button-small" type="button" data-uk-toggle={viewBackingSheetClass} onClick={() => this.fetchBackingSheets(highestVersion.quoteId)}>
                                View
                            </button>) : (<p>-</p>)}
                    </td>
                    <td>
                        {!isPending ? 
                        (<div>
                            <button className="uk-button uk-button-default uk-button-small" type="button" data-uk-toggle={viewCollateralDialogClass}>
                                View
                            </button>
                            <div id={collateralDialogName} data-uk-modal="center: true">
                                <QuoteCollateralDialog collateral={highestVersion.collateralList} />
                            </div>
                        </div>) : (<p>-</p>)}
                    </td>
                    <td>{!isPending ? (highestVersion.sheetCount) : (<p>-</p>)}</td>
                    <td>{!isPending ? format(highestVersion.totalIncCCL, { locale: 'en-GB'}) : (<p>-</p>)}</td>
                    <td>{billingAccuracy}</td>
                    <td>{serviceDesk}</td>
                    <td>
                        {!isPending ? 
                        (<button className="uk-button uk-button-default uk-button-small" type="button" data-uk-tooltip="title: Download" onClick={() => this.exportQuote(highestVersion.quoteId)}>
                            <span data-uk-icon="icon: cloud-download" />
                        </button>) 
                        : null}
                    </td>
                </tr>
            );
        });

        return (
            <div>
                <table className="uk-table uk-table-divider">
                    <thead>
                        <tr>
                            <th>Supplier</th>
                            <th>Id</th>
                            <th>Version</th>
                            <th>Contract Rates</th>
                            <th>Collateral</th>
                            <th>Site count</th>
                            <th>Contract Value</th>
                            <th>Billing Accuracy</th>
                            <th>Service Desk</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quotes}
                    </tbody>
                </table>
            </div>
        )
    }
    getFormattedDateTime(dateTime: string){
        return moment.utc(dateTime).local().format("MMMM Do, HH:mm");
    }
    renderIssuanceContent(issuance: TenderIssuance){
        var supplierCount = issuance.packs.length;
        var lastIssued = this.getFormattedDateTime(issuance.packs[issuance.packs.length - 1].lastIssued);
        var created = this.getFormattedDateTime(issuance.created);
        var expiry = this.getFormattedDateTime(issuance.expiry);

        var summaryReportsDialogName = `modal-generate-summary-${issuance.issuanceId}`;
        var summaryReportsDialogClass = `target: #${summaryReportsDialogName}`;

        var offersTable = this.renderOffersTable(issuance.packs);
        return (
            <div key={issuance.issuanceId}>
                <div className="uk-grid uk-margin-small-left uk-margin-small-right uk-grid-match" data-uk-grid>
                    <div className="uk-card uk-card-default uk-card-small uk-card-body uk-width-1-4 uk-text-center">
                        <p className="uk-text-bold uk-margin-small">{created}</p>
                        <p className="uk-text-meta uk-margin-small">Created</p>
                    </div>
                    <div className="uk-card uk-card-default uk-card-small uk-card-body uk-width-1-4 uk-text-center">
                        <p className="uk-text-bold uk-margin-small">{supplierCount}</p>
                        <p className="uk-text-meta uk-margin-small">Supplier Count</p>
                    </div>
                    <div className="uk-card uk-card-default uk-card-small uk-card-body uk-width-1-4 uk-text-center">
                        <p className="uk-text-bold uk-margin-small">{lastIssued}</p>
                        <p className="uk-text-meta uk-margin-small">Last issued</p>
                    </div>
                    <div className="uk-card uk-card-default uk-card-small uk-card-body uk-width-1-4 uk-text-center">
                        <p className="uk-text-bold uk-margin-small">{expiry}</p>
                        <p className="uk-text-meta uk-margin-small">Expiry</p>
                    </div>
                </div>
                <div className="uk-margin">
                <div className="uk-grid" data-uk-grid>
                    <div className="uk-width-expand@s">
                        <h3>Offers</h3>
                    </div>
                    <div className="uk-width-1-3">
                        <button className="uk-button uk-button-default uk-button-small uk-align-right" type="button" data-uk-toggle={summaryReportsDialogClass}>
                            <span className="uk-margin-small-right" data-uk-icon="icon: shrink" />
                            Summary Reports
                        </button>
                    </div>
                </div>
                    {offersTable}
                </div>
                <div id={summaryReportsDialogName} data-uk-modal="center: true">
                    <GenerateSummaryReportDialog tender={this.props.tender} issuance={issuance} />
                </div>
            </div>
        )
    }

    renderSectionContent(){
        if(this.props.tender.issuances == null || this.props.tender.issuances.length == 0)
        {
            var unissuedCount = this.props.tender.unissuedPacks.length == 0 ? null : ` (${this.props.tender.unissuedPacks.length} packs awaiting issuance)`;
            return (<p className="uk-margin-small">No packs have been issued for this tender yet<i><strong>{unissuedCount}</strong></i>.</p>);
        }
        
        var tabs: any = [];
        var tabContent: any = [];

        this.props.tender.issuances.map((issuance, index) => {
            var tabName = index == 0 ? "Latest" : index + 1;
            var tab = (<li key={index}><a href="#">{tabName}</a></li>);
            tabs[index] = tab;

            var content = this.renderIssuanceContent(issuance);
            tabContent[index] = content;
        });

        return (
            <div className="uk-margin-top">
                <ul data-uk-tab>
                    {tabs}
                </ul>
                <ul className="uk-switcher">
                    {tabContent}
                </ul>
            </div>
        )


    }
    render(){
        if(this.props.working){
            return (<Spinner hasMargin={true} />)
        }
        
        var unissuedDialogName = `modal-view-unissued-${this.props.tender.tenderId}`;
        var unissuedDialogClass = `target: #${unissuedDialogName}`;

        var issuePackDialogName = `modal-issue-pack-${this.props.tender.tenderId}`;
        var issuePackDialogClass = `target: #${issuePackDialogName}`;

        var backingSheetsDialogName = `modal-view-quote-bs-${this.props.tender.tenderId}`;

        var canIssue = this.props.tender.unissuedPacks != null && this.props.tender.unissuedPacks.length != 0;

        var content = this.renderSectionContent();
        return (
            <div className="uk-card uk-card-default uk-card-body">
                <div className="uk-grid" data-uk-grid>
                    <div className="uk-width-expand@s">
                        <h3>Issued Packs</h3>
                    </div>
                    <div className="uk-width-1-3">
                        <button className="uk-button uk-button-primary uk-button-small uk-align-right" type="button" data-uk-toggle={issuePackDialogClass} disabled={!canIssue}>
                            <span className="uk-margin-small-right" data-uk-icon="icon: push" />
                            Issue
                        </button>
                        <button className="uk-button uk-button-default uk-button-small uk-align-right" type="button" data-uk-toggle={unissuedDialogClass}>
                            <span className="uk-margin-small-right" data-uk-icon="icon: album" />
                            View Unissued
                        </button>
                    </div>
                </div>
                <div>
                    {content}
                </div>
                <div id={unissuedDialogName} data-uk-modal="center: true">
                    <TenderPackDialog tender={this.props.tender} portfolioId={this.props.tender.portfolioId}/>
                </div>

                <div id={backingSheetsDialogName} data-uk-modal="center: true">
                    <TenderBackingSheetsDialog />
                </div>

                <div id={issuePackDialogName} data-uk-modal="center: true">
                    <IssueTenderPackDialog tender={this.props.tender} portfolioId={this.props.tender.portfolioId} />
                </div>
        </div>);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, TenderQuotesViewProps> = (dispatch) => {
    return {
        fetchQuoteBackingSheets: (tenderId: string, quoteId: string) => dispatch(fetchQuoteBackingSheets(tenderId, quoteId)),
        exportContractRates: (tenderId: string, quoteId: string) => dispatch(exportContractRates(tenderId, quoteId))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, TenderQuotesViewProps> = (state: ApplicationState) => {
    return {
        suppliers: state.portfolio.tender.suppliers.value,
        working: state.portfolio.tender.suppliers.working
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(TenderQuotesView);