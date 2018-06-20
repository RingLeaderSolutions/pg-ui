import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';

import Spinner from '../../common/Spinner';
import * as moment from 'moment';

import TenderBackingSheetsDialog from './TenderBackingSheetsDialog';
import TenderQuoteSummariesDialog from './TenderQuoteSummariesDialog';
import QuoteCollateralDialog from './QuoteCollateralDialog';

import { fetchQuoteBackingSheets, exportContractRates, deleteQuote, generateTenderPack } from '../../../actions/tenderActions';
import { Tender, TenderSupplier, TenderQuote, TenderIssuance, TenderPack } from "../../../model/Tender";
import { format } from 'currency-formatter';
import GenerateSummaryReportDialog from "./GenerateSummaryReportDialog";
import UploadOfferDialog from "./UploadOfferDialog";
import IssueTenderPackDialog from "./IssueTenderPackDialog";
import TenderPackDialog from "./TenderPackDialog";
const UIkit = require('uikit'); 

interface TenderQuotesViewProps {
    tender: Tender;
}

interface StateProps {
    suppliers: TenderSupplier[];
    working: boolean;
}
  
interface DispatchProps {
    fetchQuoteBackingSheets: (tenderId: string, quoteId: string) => void;
    exportContractRates: (tenderId: string, quoteId: string) => void;
    deleteQuote: (tenderId: string, quoteId: string) => void;
    generateTenderPack: (portfolioId: string, tenderId: string) => void;
}

class TenderQuotesView extends React.Component<TenderQuotesViewProps & StateProps & DispatchProps, {}> {

    fetchBackingSheets(quoteId: string){
        this.props.fetchQuoteBackingSheets(this.props.tender.tenderId, quoteId);
    }

    exportQuote(quoteId: string){
        this.props.exportContractRates(this.props.tender.tenderId, quoteId);
    }

    deleteQuote(quoteId: string){
        this.props.deleteQuote(this.props.tender.tenderId, quoteId);
    }
    
    mapStatusToLabel(status: string){
        var labelType = "success"
        switch(status)
        {
            case "PENDING":
                labelType = "warning";
                break;
            case "SUBMITTED":
                labelType = "success";
                break;
            case "meterErrors":
                labelType = "danger"
                break;
        }
        
        var labelClass = `uk-label uk-label-${labelType}`;
        return (<span className={labelClass}>{status}</span>);
    }

    renderOffersTable(packs: TenderPack[]){
        var quotes = packs.map((p) => {
            return p.quotes
            .sort((q1: TenderQuote, q2: TenderQuote) => {        
                if (q1.version < q2.version) return 1;
                if (q1.version > q2.version) return -1;
                return 0;
            })
            .map((quote) => {
                var supplier = this.props.suppliers.find(su => su.supplierId == quote.supplierId);

                var viewBackingSheetClass = `target: #modal-view-quote-bs-${this.props.tender.tenderId}`;

                var collateralDialogName = `modal-view-collateral-${quote.quoteId}`;
                var viewCollateralDialogClass = `target: #${collateralDialogName}`;

                var isPending = quote.status == "PENDING";

                return (
                    <tr key={quote.quoteId}>
                        <td><img src={supplier.logoUri} style={{ width: "70px"}}/></td>
                        <td>{this.mapStatusToLabel(quote.status)}</td>  
                        <td>{!isPending ? quote.version: (<p>N/A</p>)}</td>
                        <td>{!isPending ? `${quote.contractLength} months` : (<p>-</p>)}</td>
                        <td>{!isPending ? (quote.sheetCount) : (<p>-</p>)}</td>
                        <td>{!isPending ? format(quote.totalIncCCL, { locale: 'en-GB'}) : (<p>-</p>)}</td>
                        <td>{!isPending ? `${quote.appu.toFixed(4)}p` : (<p>-</p>)}</td>
                        <td>
                            {!isPending ? (
                                <div>
                                    <div className="uk-inline">
                                        <button className="uk-button uk-button-default" type="button">
                                            <span data-uk-icon="icon: more" />
                                        </button>
                                        <div data-uk-dropdown="pos:bottom-justify;mode:click">
                                            <ul className="uk-nav uk-dropdown-nav">
                                            <li><a href="#" onClick={() => this.exportQuote(quote.quoteId)}>
                                                <span className="uk-margin-small-right" data-uk-icon="icon: cloud-download" />
                                                Download
                                            </a></li>
                                            <li className="uk-nav-divider"></li>
                                            <li><a href="#" data-uk-toggle={viewBackingSheetClass} onClick={() => this.fetchBackingSheets(quote.quoteId)}>
                                                <span className="uk-margin-small-right" data-uk-icon="icon: album" />
                                                View Contract Rates
                                            </a></li>
                                            <li className="uk-nav-divider"></li>
                                            <li><a href="#" data-uk-toggle={viewCollateralDialogClass}>
                                                <span className="uk-margin-small-right" data-uk-icon="icon: folder" />                                        
                                                View Collateral
                                            </a></li>
                                            <li className="uk-nav-divider"></li>
                                            <li><a href="#" onClick={() => this.deleteQuote(quote.quoteId)}>
                                                <span className="uk-margin-small-right" data-uk-icon="icon: trash" />                                        
                                                Delete
                                            </a></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div id={collateralDialogName} data-uk-modal="center: true">
                                        <QuoteCollateralDialog collateral={quote.collateralList} />
                                    </div>
                                </div>) 
                            : null}
                        </td>
                    </tr>
                );
            });
        });

        return (
            <div>
                <table className="uk-table uk-table-divider">
                    <thead>
                        <tr>
                            <th>Supplier</th>
                            <th>Status</th>
                            <th>Version</th>
                            <th>Contract Length</th>
                            <th>Meter count</th>
                            <th>Contract Value</th>
                            <th>Avg pence per unit</th>
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

        var createRecommendationDialogName = `modal-create-recommendation-${issuance.issuanceId}`;
        var createRecommendationDialogClass = `target: #${createRecommendationDialogName}`;

        var viewRecommendationsDialogName = `modal-view-recommendations-${this.props.tender.tenderId}`;
        var viewRecommendationsDialogClass = `target: #${viewRecommendationsDialogName}`;

        var uploadOfferName = `modal-upload-offer-${this.props.tender.tenderId}`;
        var uploadOfferClass = `target: #${uploadOfferName}`;

        var hasReceivedQuotes = issuance.packs.some(
            (p: TenderPack) => {
                return p.quotes.some(
                    (q:TenderQuote) => q.status != "PENDING") });

        var hasValidQuotes = issuance.packs.some(
            (p: TenderPack) => {
                return p.quotes.some(
                    (q:TenderQuote) => q.status == "SUBMITTED") });


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
                    <div className="uk-width-1-2">
                        <div>
                            <div className="uk-inline">
                                <button className="uk-button uk-button-default uk-button-small uk-align-right" type="button" disabled={!hasReceivedQuotes || !hasValidQuotes}>
                                    <span className="uk-margin-small-right" data-uk-icon="icon: file-edit" />                        
                                    Recommendations
                                </button>
                                <div data-uk-dropdown="pos:bottom-justify;mode:click">
                                    <ul className="uk-nav uk-dropdown-nav">
                                    <li><a href="#" data-uk-toggle={viewRecommendationsDialogClass}>
                                        <span className="uk-margin-small-right" data-uk-icon="icon: table" />
                                        View Existing
                                    </a></li>
                                    <li className="uk-nav-divider"></li>
                                    <li><a href="#" data-uk-toggle={createRecommendationDialogClass}>
                                        <span className="uk-margin-small-right" data-uk-icon="icon: plus" />
                                        Create New
                                    </a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <button className="uk-button uk-button-primary uk-button-small uk-align-right" type="button" data-uk-toggle={uploadOfferClass}>
                            <span className="uk-margin-small-right" data-uk-icon="icon: cloud-upload" />
                            Upload Offer
                        </button>
                    </div>
                </div>
                    {offersTable}
                </div>
                <div id={createRecommendationDialogName} data-uk-modal="center: true">
                    <GenerateSummaryReportDialog tender={this.props.tender} issuance={issuance} />
                </div>
                <div id={viewRecommendationsDialogName} data-uk-modal="center: true">
                    <TenderQuoteSummariesDialog tender={this.props.tender} />
                </div>
                <div id={uploadOfferName} data-uk-modal="center: true">
                    <UploadOfferDialog tenderId={this.props.tender.tenderId} assignedSuppliers={this.props.tender.assignedSuppliers} utilityType={this.props.tender.utility} />
                </div>
            </div>
        )
    }

    generateNewPack(){
        var deadlineHasPassed = moment().diff(moment(this.props.tender.deadline), 'days') > 0;
        if(deadlineHasPassed){
            UIkit.modal.alert("Sorry, this tender's deadline is now in the past. Please update this before generating a new requirements pack.")
            return;
        }

        if(this.props.tender.assignedSuppliers.length <= 0){
            UIkit.modal.alert("Sorry, this tender does not have any assigned suppliers. Please assign at least one supplier before generating a new requirements pack..")
            return;
        }

        this.props.generateTenderPack(this.props.tender.portfolioId, this.props.tender.tenderId);
    }

    renderSectionContent(){
        if(this.props.tender.issuances == null || this.props.tender.issuances.length == 0)
        {
            var unissuedCount = this.props.tender.unissuedPacks.length == 0 ? null : ` (${this.props.tender.unissuedPacks.length} packs awaiting issuance)`;
            return (<p className="uk-margin-small">No packs have been issued for this tender yet<i><strong>{unissuedCount}</strong></i>.</p>);
        }
        
        var tabs: any = [];
        var tabContent: any = [];

        this.props.tender.issuances
            .sort(
                (i1: TenderIssuance, i2: TenderIssuance) => {
                    var firstDate = moment.utc(i1.created).unix();
                    var secondDate = moment.utc(i2.created).unix();
            
                    if (firstDate > secondDate) return -1;
                    if (firstDate < secondDate) return 1;
                    return 0;
                })
            .map((issuance, index) => {
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
                        <h3>Issued Requirements</h3>
                    </div>
                    <div className="uk-width-1-2">
                        <div className="uk-inline">
                            <button className="uk-button uk-button-default uk-button-small uk-align-right" type="button">
                                <span className="uk-margin-small-right" data-uk-icon="icon: table" />                        
                                Packs
                            </button>
                            <div data-uk-dropdown="pos:bottom-justify;mode:click">
                                <ul className="uk-nav uk-dropdown-nav">
                                <li><a href="#" onClick={() => this.generateNewPack()}>
                                    <span className="uk-margin-small-right" data-uk-icon="icon: plus" />
                                    Generate New
                                </a></li>
                                <li className="uk-nav-divider"></li>
                                <li><a href="#" data-uk-toggle={unissuedDialogClass} >
                                    <span className="uk-margin-small-right" data-uk-icon="icon: album" />
                                    View Unissued
                                </a></li>
                                <li className="uk-nav-divider"></li>
                                { canIssue ? (<li><a href="#" data-uk-toggle={issuePackDialogClass}>
                                    <span className="uk-margin-small-right" data-uk-icon="icon: push" />
                                    Issue
                                </a></li>) : null }
                                </ul>
                            </div>
                        </div>
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
        exportContractRates: (tenderId: string, quoteId: string) => dispatch(exportContractRates(tenderId, quoteId)),
        deleteQuote: (tenderId: string, quoteId: string) => dispatch(deleteQuote(tenderId, quoteId)),
        generateTenderPack: (portfolioId: string, tenderId: string) => dispatch(generateTenderPack(portfolioId, tenderId))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, TenderQuotesViewProps> = (state: ApplicationState) => {
    return {
        suppliers: state.portfolio.tender.suppliers.value,
        working: state.portfolio.tender.suppliers.working
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(TenderQuotesView);