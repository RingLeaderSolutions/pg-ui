import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../../applicationState';

import Spinner from '../../../common/Spinner';
import * as moment from 'moment';

import TenderBackingSheetsDialog from '../TenderBackingSheetsDialog';
import QuoteCollateralDialog from './QuoteCollateralDialog';

import { fetchQuoteBackingSheets, exportContractRates, deleteQuote, generateTenderPack } from '../../../../actions/tenderActions';
import { Tender, TenderSupplier, TenderQuote, TenderIssuance, TenderPack, QuoteIndicator, QuoteBestCategoryEntry } from "../../../../model/Tender";
import { format } from 'currency-formatter';
import UploadOfferDialog from "./UploadOfferDialog";
import IssueTenderPackDialog from "../IssueTenderPackDialog";
import { openModalDialog } from "../../../../actions/viewActions";
import ModalDialog from "../../../common/ModalDialog";
const UIkit = require('uikit'); 

interface TenderOffersTableProps {
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
    openModalDialog: (dialogId: string) => void;
}

class TenderOffersTable extends React.Component<TenderOffersTableProps & StateProps & DispatchProps, {}> {
    fetchAndDisplayRates(quoteId: string, ratesDialogName: string){
        this.props.fetchQuoteBackingSheets(this.props.tender.tenderId, quoteId);
        this.props.openModalDialog(ratesDialogName);
    }

    exportQuote(quoteId: string){
        this.props.exportContractRates(this.props.tender.tenderId, quoteId);
    }

    deleteQuote(quoteId: string){
        this.props.deleteQuote(this.props.tender.tenderId, quoteId);
    }
    
    mapIndicatorsToIcons(indicators: QuoteIndicator[]){
        var errorIconColor = "#ff0000";
        var warningIconColor = "#ffa500";

        var indicatorIcons = indicators.map((i, index) => {
            var margin = index == 0 ? null : "uk-margin-small-left";

            switch(i.type){
                case "EMAIL":
                    return (<i key={index} className={`fas fa-envelope ${margin}`} data-uk-tooltip="title:This offer was uploaded via email."/>);
                case "UPLOAD":
                    return (<i key={index} className={`fas fa-cloud-upload-alt ${margin}`} data-uk-tooltip="title:This offer was uploaded manually."/>);
                case "METER_ERROR":
                    return (<i key={index} style={{color: errorIconColor}} className={`fas fa-cube ${margin}`} data-uk-tooltip="title:This offer has missing meters or are in an error state."/>);
                case "DATE_ERROR":
                    return (<i key={index} style={{color: errorIconColor}} className={`fas fa-calendar-alt ${margin}`} data-uk-tooltip="title:This offer has incorrect dates on its meters."/>);
                case "CONSUMPTION_VARIATION":
                    return (<i key={index} style={{color: warningIconColor}} className={`fas fa-chart-line ${margin}`} data-uk-tooltip="title:This offer's consumption varies by more than 10%."/>);
                case "TARIFF_VARIATION":
                    return (<i key={index} style={{color: errorIconColor}} className={`fas fa-exclamation-triangle ${margin}`} data-uk-tooltip="title:This offer has meters with tariffs that do not match the previously accepted periods."/>);
            }
        });
        return (<div>{indicatorIcons}</div>)
    }

    renderBestCategories(bestCategories: QuoteBestCategoryEntry[]){
        return bestCategories.map((bc, index) => {
            var className = index == 0 ? "" : "uk-margin-small-left";

            var title = bc.title;
            var tooltipTitle = bc.title;
            if(bc.title == "totalCCL"){
                title = "Total";
                tooltipTitle = "Total inc. CCL"
            }

            var tooltip = `This offer scores as the lowest price in <strong>${tooltipTitle}</strong> for <strong>${bc.score} meter(s).</strong>`;
            return (<span key={index} className={`uk-label uk-label-success ${className}`} data-uk-tooltip={`title:${tooltip}`}>{title}: {bc.score}</span>)
        })
    }

    renderPendingSuppliers(packs: TenderPack[]){
        var pendingSupplierCards = packs
        .sort((p1: TenderPack, p2: TenderPack) => {        
            if (p1.supplierId < p2.supplierId) return 1;
            if (p1.supplierId > p2.supplierId) return -1;
            return 0;
        })
        .map(p => {
            var supplier = this.props.suppliers.find(su => su.supplierId == p.supplierId);
            var supplierImage = supplier == null ? "Unknown" : (<img data-uk-tooltip={`title:${supplier.name}`} src={supplier.logoUri} style={{ maxWidth: "105px", maxHeight: "60px" }}/>);

            return (
                <div key={p.supplierId}>
                    <div key={p.supplierId} className="uk-card uk-card-small uk-card-default uk-card-body">
                        <div className="uk-text-center uk-text-middle">
                            {supplierImage}
                        </div>
                    </div>
                </div>);
        })
        return (
            <div className="uk-child-width-1-5 uk-grid-match uk-grid-height-match" data-uk-grid>
                {pendingSupplierCards}
            </div>
        )
    }

    renderReceivedOffers(packs: TenderPack[]){
        var quotes = packs
        .map((p) => {
            return p.quotes
            // Order the quotes of the pack so that the latest version appears first in the list
            .sort((q1: TenderQuote, q2: TenderQuote) => {        
                if (q1.version < q2.version) return 1;
                if (q1.version > q2.version) return -1;
                return 0;
            })
            .map((quote) => {
                var supplier = this.props.suppliers.find(su => su.supplierId == quote.supplierId);
                var supplierImage = supplier == null ? "Unknown" : (<img src={supplier.logoUri} style={{ maxWidth: "70px", maxHeight: "40px"}}/>);

                var viewQuoteModalName = `view_quote_rates_${this.props.tender.tenderId}`;
                var collateralDialogName = `view_collateral_${quote.quoteId}`;

                return (
                    <tr key={quote.quoteId}>
                        <td>{supplierImage}</td>
                        <td>{`${quote.contractLength} months`}</td>
                        <td>{this.mapIndicatorsToIcons(quote.indicators)}</td>  
                        <td>{quote.version}</td>
                        <td>{format(quote.totalIncCCL, { locale: 'en-GB'})}</td>
                        <td>{`${quote.appu.toFixed(4)}p`}</td>
                        <td>{this.renderBestCategories(quote.bestCategories)}</td>
                        <td>
                            <div>
                                <div className="uk-inline">
                                    <button className="uk-button uk-button-default" type="button">
                                        <i className="fa fa-ellipsis-v"></i>
                                    </button>
                                    <div data-uk-dropdown="pos:bottom-justify;mode:click">
                                        <ul className="uk-nav uk-dropdown-nav">
                                        <li><a href="#" onClick={() => this.exportQuote(quote.quoteId)}>
                                            <i className="fas fa-cloud-download-alt uk-margin-small-right"></i>
                                            Download
                                        </a></li>
                                        <li className="uk-nav-divider"></li>
                                        <li><a href="#" onClick={() => this.fetchAndDisplayRates(quote.quoteId, viewQuoteModalName)}>
                                            <i className="fas fa-pound-sign uk-margin-small-right"></i>
                                            View Contract Rates
                                        </a></li>
                                        <li className="uk-nav-divider"></li>
                                        <li><a href="#" onClick={() => this.props.openModalDialog(collateralDialogName)}>
                                            <i className="fas fa-folder-open uk-margin-small-right"></i>                                      
                                            View Collateral
                                        </a></li>
                                        <li className="uk-nav-divider"></li>
                                        <li><a href="#" onClick={() => this.deleteQuote(quote.quoteId)}>
                                            <i className="fas fa-trash uk-margin-small-right" style={{color: "#FF0000"}}></i>                              
                                            Delete
                                        </a></li>
                                        </ul>
                                    </div>
                                </div>
                                <ModalDialog dialogId={collateralDialogName}>
                                    <QuoteCollateralDialog collateral={quote.collateralList} />
                                </ModalDialog>
                            </div>
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
                            <th>Contract Length</th>
                            <th>Status</th>
                            <th>Version</th>
                            <th>Contract Value</th>
                            <th>APPU</th>
                            <th></th>
                            <th></th>
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

        var uploadOfferName = `upload_offer_${this.props.tender.tenderId}`;

        var hasReceivedQuotes = issuance.packs.some(
            (p: TenderPack) => {
                return p.quotes.some(
                    (q:TenderQuote) => q.status != "PENDING") });

        var hasValidQuotes = issuance.packs.some(
            (p: TenderPack) => {
                return p.quotes.some(
                    (q:TenderQuote) => q.status == "SUBMITTED") });


        var pendingQuotes = issuance.packs.filter((p: TenderPack) => {
            return p.quotes.some((q:TenderQuote) => q.status == "PENDING")
        });
        
        var receivedQuotes = issuance.packs.filter((p: TenderPack) => {
            return p.quotes.every((q:TenderQuote) => q.status != "PENDING")
        });

        var hasReceivedQuotes = receivedQuotes.length != 0;

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
                <div className="uk-margin-medium-top">
                    <div className="uk-grid" data-uk-grid>
                        <div className="uk-width-expand@s">
                            {hasReceivedQuotes ? (<h3>Offers</h3>) : (<h3>Pending Supplier Responses</h3>)}
                        </div>
                        <div className="uk-width-1-2">
                            <button className="uk-button uk-button-primary uk-button-small uk-align-right" type="button"onClick={() => this.props.openModalDialog(uploadOfferName)}>
                                <i className="fa fa-file-upload uk-margin-small-right fa-lg"></i>
                                Upload Offer
                            </button>
                        </div>
                    </div>

                    {hasReceivedQuotes ? (
                        <div className="uk-margin-small-top">
                            <ul data-uk-tab className="uk-tab">
                                <li><a href="#"><i className="fas fa-envelope-open uk-margin-small-right fa-lg"></i>Received</a></li>
                                <li><a href="#"><i className="fas fa-hourglass-half uk-margin-small-right fa-lg"></i>Pending Responses ({pendingQuotes.length})</a></li>
                            </ul>
                            <ul className='uk-switcher'>
                                <li>{this.renderReceivedOffers(receivedQuotes)}</li>
                                <li>{this.renderPendingSuppliers(pendingQuotes)}</li>
                            </ul>
                        </div>) : this.renderPendingSuppliers(pendingQuotes)}
                </div>
                <ModalDialog dialogId={uploadOfferName}>
                    <UploadOfferDialog tenderId={this.props.tender.tenderId} assignedSuppliers={this.props.tender.assignedSuppliers} utilityType={this.props.tender.utility} />
                </ModalDialog>
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
            UIkit.modal.alert("Sorry, this tender does not have any assigned suppliers. Please assign at least one supplier before generating a new requirements pack.")
            return;
        }

        if(this.props.tender.offerTypes == null || this.props.tender.offerTypes.length == 0){
            UIkit.modal.alert("Sorry, this tender does not have any requested contract durations. Please rectify this by editing the tender and selecting at least one duration.")
            return;
        }

        this.props.generateTenderPack(this.props.tender.portfolioId, this.props.tender.tenderId);
    }

    renderUnissued(){
        if(this.props.tender.unissuedPacks == null || this.props.tender.unissuedPacks.length == 0){
            return (<p>There are no unissued requirements packs for this tender.</p>);
        }

        var tableContent = this.props.tender.unissuedPacks.map(p => {
            var supplier = this.props.suppliers.find(s => s.supplierId == p.supplierId);
            var supplierImage = supplier == null ? "Unknown" : (<img src={supplier.logoUri} style={{ maxWidth: "70px", maxHeight: "40px"}}/>);

            return (
                <tr key={p.packId}>
                    <td>{<span className="uk-label uk-label-success">{p.packId.substring(0, 8)}</span>}</td>
                    <td>{moment.utc(p.created).local().format("MMMM Do, HH:mm")}</td>
                    <td>{p.meterCount}</td>
                    <td>{supplierImage}</td>
                    <td>
                        <a className="uk-button uk-button-default uk-button-small" href={p.zipFileName} data-uk-tooltip="title:Download">
                            <i className="fas fa-cloud-download uk-margin-small-right"></i>
                        </a> 
                    </td>
                </tr>
            )
        });

        return (
            <div key="unissued-content">
                <div className="uk-grid-small" data-uk-grid>
                    <div className="uk-width-expand" />
                    <div className="uk-width-auto">
                        <button className="uk-button uk-button-primary uk-button-small" type="button" onClick={() => this.props.openModalDialog("issue_requirements_pack")}>
                            <i className="fas fa-envelope uk-margin-small-right"></i>
                            Issue
                        </button>
                    </div>
                </div>
                <div className="uk-alert-info uk-margin-small-top uk-margin-small-bottom" data-uk-alert>
                    <p><i className="fas fa-info-circle uk-margin-small-right"></i>These requirements packs have not yet been issued.</p>
                </div>
                <table className="uk-table uk-table-divider">
                    <thead>
                        <tr>
                            <th>Pack ID</th>
                            <th>Created</th>
                            <th>Meter #</th>
                            <th>Supplier</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableContent}
                    </tbody>
                </table>
                <ModalDialog dialogId="issue_requirements_pack">
                    <IssueTenderPackDialog tender={this.props.tender} portfolioId={this.props.tender.portfolioId} />
                </ModalDialog>
            </div>)
    }

    renderOffersContent(){
        if(this.props.tender.issuances == null || this.props.tender.issuances.length == 0)
        {
            if(this.props.tender.unissuedPacks != null && this.props.tender.unissuedPacks.length > 0){
                return this.renderUnissued();
            }

            return (<p className="uk-margin-small">No requirements packs have been generated or issued for this tender yet<i> Generate some using the menu above.</i>.</p>);
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
                var tabName = moment.utc(issuance.created).local().format("MMMM Do YYYY");
                var tab = (<li key={index}><a href="#">{tabName}</a></li>);
                tabs[index] = tab;

                var content = this.renderIssuanceContent(issuance);
                tabContent[index] = content;
            });

        tabs.push((<li key="unissued"><a href="#">Unissued</a></li>));
        tabContent.push(this.renderUnissued());

        return (
            <div className="uk-margin-top">
                <ul data-uk-tab="connect: #offerTabSwitcher">
                    {tabs}
                </ul>
                <ul id="offerTabSwitcher" className="uk-switcher">
                    {tabContent}
                </ul>
            </div>
        )
    }
    
    renderCardContent(content: any){
        return (
            <div className="uk-card uk-card-default">
                <div className="uk-card-body">
                    {content}
                </div>
            </div>)
    }

    render(){
        if(this.props.working){
            let content = (<Spinner hasMargin={true} />);
            return this.renderCardContent(content);
        }
        if(this.props.tender.existingContract == null || this.props.tender.existingContract.sheetCount == 0){
            let content = (
                    <div className="uk-alert-warning uk-margin-small-bottom uk-alert" data-uk-alert>
                        <div className="uk-grid uk-grid-small" data-uk-grid>
                            <div className="uk-width-auto">
                                <i className="fas fa-exclamation-triangle uk-margin-small-right"></i>
                            </div>
                            <div className="uk-width-expand">
                                <p>Tender setup appears to be incomplete. Please ensure an existing contract has been created and its rates have been uploaded.</p>    
                            </div>
                        </div>
                    </div>)

            return this.renderCardContent(content);
        }
        
        var viewQuoteRatesDialogName = `view_quote_rates_${this.props.tender.tenderId}`;

        var offersContent = this.renderOffersContent();
        let content = (
            <div>
                <div className="uk-grid" data-uk-grid>
                    <div className="uk-width-expand@s">
                        <h3>Requirements Packs</h3>
                    </div>
                    <div className="uk-width-1-2">
                        <button className="uk-button uk-button-primary uk-button-small uk-align-right" type="button" onClick={() => this.generateNewPack()}>
                            <i className="fas fa-plus-circle uk-margin-small-right fa-lg"></i>
                            Generate New
                        </button>
                    </div>
                </div>
                <div>
                    {offersContent}
                </div>
                <ModalDialog dialogId={viewQuoteRatesDialogName} dialogClass="backing-sheet-modal">
                    <TenderBackingSheetsDialog />
                </ModalDialog>
        </div>);

        return this.renderCardContent(content);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, TenderOffersTableProps> = (dispatch) => {
    return {
        fetchQuoteBackingSheets: (tenderId: string, quoteId: string) => dispatch(fetchQuoteBackingSheets(tenderId, quoteId)),
        exportContractRates: (tenderId: string, quoteId: string) => dispatch(exportContractRates(tenderId, quoteId)),
        deleteQuote: (tenderId: string, quoteId: string) => dispatch(deleteQuote(tenderId, quoteId)),
        generateTenderPack: (portfolioId: string, tenderId: string) => dispatch(generateTenderPack(portfolioId, tenderId)),
        openModalDialog: (dialogId: string) => dispatch(openModalDialog(dialogId))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, TenderOffersTableProps> = (state: ApplicationState) => {
    return {
        suppliers: state.portfolio.tender.suppliers.value,
        working: state.portfolio.tender.suppliers.working
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(TenderOffersTable);