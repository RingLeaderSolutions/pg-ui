import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../../applicationState';

import * as moment from 'moment';

import OfferCollateralDialog, { OfferCollateralDialogData } from './OfferCollateralDialog';

import { fetchQuoteBackingSheets, exportContractRates, deleteQuote, generateTenderPack } from '../../../../actions/tenderActions';
import { Tender, TenderSupplier, TenderQuote, TenderIssuance, TenderPack, isComplete } from "../../../../model/Tender";
import { format } from 'currency-formatter';
import UploadOfferDialog, { UploadOfferDialogData } from "./UploadOfferDialog";
import IssueTenderPackDialog, { IssueTenderPackDialogData } from "./IssueTenderPackDialog";
import { openDialog, openAlertDialog } from "../../../../actions/viewActions";
import { DropdownItem, Button, UncontrolledDropdown, DropdownToggle, Row, DropdownMenu, UncontrolledTooltip, Col, Alert, Card, CardHeader, CardBody } from "reactstrap";
import { LoadingIndicator } from "../../../common/LoadingIndicator";
import Badge from "reactstrap/lib/Badge";
import { ModalDialogNames } from "../../../common/modal/ModalDialogNames";
import ContractRatesDialog from "../ContractRatesDialog";
import { IsNullOrEmpty } from "../../../../helpers/extensions/ArrayExtensions";
import QuickOfferDialog, { QuickOfferDialogData } from "./QuickOfferDialog";
import { MeterConsumptionSummary } from "../../../../model/Meter";
import { UtilityType } from "../../../../model/Models";
import { fetchMeterConsumption } from "../../../../actions/meterActions";

interface TenderOffersTableProps {
    tender: Tender;
}

interface StateProps {
    suppliers: TenderSupplier[];
    working: boolean;
    consumption: MeterConsumptionSummary;
}
  
interface DispatchProps {
    fetchQuoteBackingSheets: (tenderId: string, quoteId: string) => void;
    exportContractRates: (tenderId: string, quoteId: string) => void;
    deleteQuote: (tenderId: string, quoteId: string) => void;
    generateTenderPack: (portfolioId: string, tenderId: string) => void;
    
    openAlertDialog: (title: string, body: string) => void;
    openIssueTenderPackDialog: (data: IssueTenderPackDialogData) => void;
    openOfferCollateralDialog: (data: OfferCollateralDialogData) => void;
    openContractRatesDialog: () => void;
    openUploadOfferDialog: (data: UploadOfferDialogData) => void;
    openQuickOfferDialog: (data: QuickOfferDialogData) => void;
    fetchMeterConsumption: (portfolioId: string, utility: UtilityType) => void;
}

enum SelectedOfferTab {
    Received,
    Pending
}

interface TenderOffersTableState {
    selectedIssuanceId: string;
    selectedOfferTab: SelectedOfferTab;
}

class TenderOffersTable extends React.Component<TenderOffersTableProps & StateProps & DispatchProps, TenderOffersTableState> {
    constructor(props: TenderOffersTableProps & StateProps & DispatchProps) {
        super(props);
        this.state = {
            selectedIssuanceId: null,
            selectedOfferTab: SelectedOfferTab.Received
        };
    }
    
    selectIssuance(selectedIssuanceId: string){
        this.setState({
            ...this.state,
            selectedIssuanceId
        });
    }

    fetchAndDisplayRates(quoteId: string){
        this.props.fetchQuoteBackingSheets(this.props.tender.tenderId, quoteId);
        this.props.openContractRatesDialog();
    }

    exportOffer(quoteId: string){
        this.props.exportContractRates(this.props.tender.tenderId, quoteId);
    }

    deleteQuote(quoteId: string){
        this.props.deleteQuote(this.props.tender.tenderId, quoteId);
    }

    renderIndicator(icon: string, index: number, quoteId: string, tooltip: string){
        let indicatorId = `indicator-${quoteId}-${index}`;
        return (
            <div key={index}>
                <i className={icon} id={indicatorId}></i>
                <UncontrolledTooltip target={indicatorId} placement="bottom">
                    {tooltip}
                </UncontrolledTooltip>
            </div>
        )
    }

    renderIndicators(quote: TenderQuote){
        let { quoteId } = quote;
        var indicatorIcons = quote.indicators.map((i, index) => {
            var margin = index == 0 ? null : "ml-1";

            switch(i.type){
                case "EMAIL":
                    return this.renderIndicator(`fas fa-envelope ${margin}`, index, quoteId, "This offer was uploaded via email.");
                case "UPLOAD":
                    return this.renderIndicator(`fas fa-cloud-upload-alt ${margin}`, index, quoteId, "This offer was uploaded manually from a supplier file.");
                case "METER_ERROR":
                    return this.renderIndicator(`fas fa-tachometer-alt text-danger ${margin}`, index, quoteId, "This offer has missing meters or are in an error state.");
                case "DATE_ERROR":
                    return this.renderIndicator(`fas fa-calendar-alt text-danger ${margin}`, index, quoteId, "This offer has incorrect dates on its meters.");
                case "CONSUMPTION_VARIATION":
                    return this.renderIndicator(`fas fa-chart-line text-orange ${margin}`, index, quoteId, "This offer's consumption varies by more than 10%.");
                case "TARIFF_VARIATION":
                    return this.renderIndicator(`fas fa-exclamation-triangle text-orange ${margin}`, index, quoteId, "This offer has meters with tariffs that do not match the previously accepted periods.");
                case "MANUAL":
                    return this.renderIndicator(`fas fa-keyboard ${margin}`, index, quoteId, "This offer was entered manually through the quick offer screen.");
                default:
                    return this.renderIndicator(`fas fa-info-circle ${margin}`, index, quoteId, i.detail);
            }
        });
        return (<div className="d-flex justify-content-center">{indicatorIcons}</div>)
    }

    renderBestCategories(quote: TenderQuote){
        let labels = quote.bestCategories.map((bc, index) => {
            var title = bc.title;
            var lowestProperty = bc.title;
            if(bc.title == "totalCCL"){
                title = "Total";
                lowestProperty = "Total inc. CCL"
            }

            let bcId = `bc-${quote.quoteId}-${index}`;
            return (
                <div key={index}>
                    <p id={bcId} className="m-0 pt-1 pl-1">
                        <Badge color="light" className="border">
                            <i className="fas fa-check text-success mr-1" />{title}: {bc.score}
                        </Badge>
                    </p>
                    <UncontrolledTooltip target={bcId} placement="bottom">
                        This offer scored as the lowest price in <strong>{lowestProperty}</strong> for <strong>{bc.score} meters.</strong>
                    </UncontrolledTooltip>
                </div>
            )
        });
        return (<div className="d-flex justify-content-center flex-wrap">{labels}</div>)
    }

    renderPendingSuppliers(packs: TenderPack[]){
        var supplierImages = packs
            .map(p => {
                var supplier = this.props.suppliers.find(su => su.supplierId == p.supplierId);
                return (
                    <div key={supplier.supplierId} className="mx-2 d-flex align-items-center">
                        <img src={supplier.logoUri} style={{maxWidth: '140px', maxHeight: '80px'}} />
                    </div>)
            });
        return (
            <div>
                <h6><i className="material-icons text-warning mr-2">autorenew</i><strong>Pending Offers:</strong></h6>
                <div className="d-flex flex-wrap justify-content-center align-items-center p-2">
                    {supplierImages}
                </div>
            </div>
        )
    }

    renderReceivedOffersTable(packs: TenderPack[]){
        let offers = this.flattenOffers(packs);
        return (
            <table className="table table-borderless offers-table">
                <tbody>
                    <tr>
                        <th className="border-right"></th>
                        {packs.map((p) => {
                            var supplier = this.props.suppliers.find(su => su.supplierId == p.supplierId);
                            var supplierImage = supplier == null ? "Unknown" : (<img src={supplier.logoUri} style={{ maxWidth: "105px", maxHeight: "60px"}}/>);
                            return (
                                <td key={`supplier-image${p.supplierId}`} colSpan={p.quotes.length}  className="text-center border-right">
                                    {supplierImage}
                                </td>)
                        })}
                    </tr>

                    <tr>
                        <th className="border-right"></th>
                        {offers.map(o => (<td key={`quote-length-${o.quoteId}`} className="text-center border-right"><p className="text-small m-0">{`${o.contractLength} months`} {`(V${o.version})`}</p></td>))}
                    </tr>                 

                    <tr className="table-highlight-grey">
                        <th className="th-contract-value text-center align-middle text-nowrap table-highlight-grey border-right"><span><i className="fas fa-money-check-alt mr-2 text-accent"></i>Contract Value</span></th>
                        {offers.map(o => (<td key={`contract-value-${o.quoteId}`} className="border-right text-center"><h4 className="m-0"><strong>{format(o.totalIncCCL, { locale: 'en-GB'})}</strong></h4></td>))}
                    </tr>

                    <tr className="table-highlight-grey">
                        <th className="th-appu text-center align-middle text-nowrap table-highlight-grey border-right"><span><i className="fas fa-coins mr-1 text-warning mr-2"></i>Avg. Pence Per Unit</span></th>
                        {offers.map(o => (<td key={`appu-${o.quoteId}`} className="border-right text-center"><h4 className="m-0">{`${o.appu.toFixed(4)}p`}</h4></td>))}
                    </tr>

                    <tr>
                        <th className="text-center align-middle text-nowrap border-right"><span><i className="fas fa-info-circle text-info mr-2"/>Indicators</span></th>
                        {offers.map(o => (<td key={`indicators-${o.quoteId}`} className="border-right text-center">{this.renderIndicators(o)}</td>))}
                    </tr>

                    <tr className="table-highlight-green">
                        <th className="th-best text-center align-middle text-nowrap table-highlight-green border-right"><span><i className="fas fa-trophy text-success mr-2"/>Best In Breed</span></th>
                        {offers.map(o => (<td key={`best-in-breed-${o.quoteId}`} className="border-right text-center">{this.renderBestCategories(o)}</td>))}
                    </tr>
                    <tr>
                        <th className="border-right"></th>
                        {offers.map(o => (
                            <td key={`actions-${o.quoteId}`} className="border-right text-center">
                                <UncontrolledDropdown>
                                    <DropdownToggle color="white" caret>
                                        <i className="material-icons text-secondary mr-1">edit</i>
                                        <span className="mr-1">Actions</span>
                                    </DropdownToggle>
                                    <DropdownMenu right>
                                        <DropdownItem href="#" onClick={() => this.exportOffer(o.quoteId)}>
                                            <span><i className="material-icons mr-1 text-secondary">cloud_download</i>Download</span>
                                        </DropdownItem>
                                        <DropdownItem href="#" onClick={() => this.props.openOfferCollateralDialog({ collateral: o.collateralList })}>
                                            <span><i className="material-icons mr-1 text-secondary">folder_open</i>View Collateral</span>
                                        </DropdownItem>
                                        <DropdownItem href="#" onClick={() => this.fetchAndDisplayRates(o.quoteId)}>
                                            <span><i className="fas fa-pound-sign mr-2 text-success" />View Rates</span>
                                        </DropdownItem>
                                        <DropdownItem divider />
                                        <DropdownItem href="#" onClick={() => this.props.deleteQuote(this.props.tender.tenderId, o.quoteId)}>
                                            <span className="text-danger"><i className="fas fa-trash-alt mr-1 text-danger" />Delete</span>
                                        </DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                                {/* <ButtonGroup>
                                    <Button color="accent" outline className="btn-grey-outline" size="sm">
                                        <i className="material-icons">cloud_download</i>
                                    </Button>
                                    <Button color="accent" outline className="btn-grey-outline" size="sm">
                                        <i className="material-icons">folder_open</i>
                                    </Button>
                                    <Button color="success" outline className="btn-grey-outline" size="sm">
                                        <i className="fas fa-eye"></i>
                                    </Button>
                                    <Button color="danger" outline className="btn-grey-outline" size="sm">
                                        <i className="material-icons">delete</i>
                                    </Button>
                                </ButtonGroup> */}
                            </td>))}
                    </tr>
                </tbody>
            </table>
        )
    }

    flattenOffers(packs: TenderPack[]){
        return packs.map((p) => {
            return p.quotes
                // Order the quotes of the pack so that the latest version appears first in the list
                .sort((q1: TenderQuote, q2: TenderQuote) => {        
                    if(q1.contractLength < q2.contractLength) return 1;
                    if(q1.contractLength > q2.contractLength) return -1;
                    
                    if (q1.version < q2.version) return 1;
                    if (q1.version > q2.version) return -1;
                    return 0;
                })})
                .SelectMany(tq => tq);
    }

    renderReceivedOffers(packs: TenderPack[]){
        let offerCards = packs
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

                    return (
                        <Col md={6} sm={12} className="mb-4">
                            <Card className="card-small h-100">
                                <CardHeader className="border-bottom px-3 py-2">
                                    <h6 className="m-0"><i className="fas fa-handshake mr-1"></i>{supplier.name} - {`${quote.contractLength} months`} - Version {quote.version}</h6>
                                </CardHeader>
                                <CardBody className="p-2">
                                    <Row className="p-2 d-flex align-items-stretch flex-grow-1" noGutters>
                                        <Col lg xs={6} className="d-flex flex-column justify-content-center text-center px-1 mt-md-0 mt-sm-3">
                                            {supplierImage}
                                        </Col>
                                        <Col lg xs={6} className="d-flex flex-column justify-content-center text-center border-left px-1 mt-md-0 mt-sm-3">
                                            <h5 className="m-0">{format(quote.totalIncCCL, { locale: 'en-GB'})}</h5>
                                            <div className="text-light pt-1"><i className="fas fa-pound mr-1 text-success"></i>Contract Value</div>
                                        </Col>
                                        <Col lg xs={6} className="d-flex flex-column justify-content-center text-center border-left px-1 mt-md-0 mt-sm-3">
                                            <h5 className="m-0">{`${quote.appu.toFixed(4)}p`}</h5>
                                            <div className="text-light pt-1"><i className="material-icons text-success mr-1">send</i>Avg. Pence Per Unit</div>
                                        </Col>
                                        <Col lg xs={6} className="d-flex flex-column justify-content-center text-center border-left px-1 mt-md-0 mt-sm-3">
                                            {this.renderIndicators(quote)}
                                        </Col>
                                        <Col lg xs={6} className="d-flex flex-column justify-content-center text-center border-left px-1 mt-md-0 mt-sm-3">
                                            {this.renderBestCategories(quote)}
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>);
                });
            })
            .SelectMany(tpo => tpo);

            return (
                <Row className="d-flex flex-wrap-1">
                    {offerCards}
                </Row>
            )
    }

    getFormattedDateTime(dateTime: string){
        return moment.utc(dateTime).local().format("MMMM Do, HH:mm");
    }

    generateNewPack(){
        var deadlineHasPassed = moment().diff(moment(this.props.tender.deadline), 'days') > 0;
        if(deadlineHasPassed){
            this.props.openAlertDialog("Warning", "Sorry, this tender's deadline is now in the past. Please update this before generating a new requirements pack.");
            return;
        }

        if(this.props.tender.assignedSuppliers.IsEmpty()){
            this.props.openAlertDialog("Warning", "Sorry, this tender does not have any assigned suppliers. Please assign at least one supplier before generating a new requirements pack.");
            return;
        }

        if(IsNullOrEmpty(this.props.tender.offerTypes)){
            this.props.openAlertDialog("Warning", "Sorry, this tender does not have any requested contract durations. Please rectify this by editing the tender and selecting at least one duration.");
            return;
        }

        this.props.generateTenderPack(this.props.tender.portfolioId, this.props.tender.tenderId);
    }

    renderUnissued(tenderComplete: boolean){
        let { unissuedPacks } = this.props.tender;
        let hasUnissued = !IsNullOrEmpty(unissuedPacks);

        let content = (
            <Alert color="light">
                <div className="d-flex align-items-center flex-column">
                    <i className="fas fa-exclamation-triangle mr-2"></i>
                    <p className="m-0 pt-2">This tender doesn't have any unissued requirements packs.</p>
                    <p className="m-0 pt-1">Click on the "Generate" button above to create some.</p>
                </div>
            </Alert>);

        if(hasUnissued){
            let tableContent = this.props.tender.unissuedPacks.map(p => {
                var supplier = this.props.suppliers.find(s => s.supplierId == p.supplierId);
                var supplierImage = supplier == null ? "Unknown" : (<img src={supplier.logoUri} style={{ maxWidth: "70px", maxHeight: "40px"}}/>);
    
                return (
                    <tr key={p.packId}>
                        <td>{p.packId.substring(0, 8)}</td>
                        <td>{moment.utc(p.created).local().format("MMMM Do, HH:mm")}</td>
                        <td>{p.meterCount}</td>
                        <td>{supplierImage}</td>
                        <td>
                            <Button color="accent" outline className="btn-grey-outline" href={p.zipFileName}>
                                <i className="fas fa-cloud-download-alt"></i>
                            </Button> 
                        </td>
                    </tr>
                )
            });

            content = (
                <table className="table">
                <thead>
                    <tr>
                        <th>Pack ID</th>
                        <th>Created</th>
                        <th>Meter #</th>
                        <th>Supplier</th>
                        <th/>
                    </tr>
                </thead>
                <tbody>
                    {tableContent}
                </tbody>
            </table>)
        }

        return (
            <Card className="card-small h-100">
                <CardHeader className="border-bottom pl-3 pr-2 py-2">
                    <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                            <h6 className="m-0"><i className="fas fa-drafting-compass mr-1"></i>Unissued Requirements Packs</h6>
                        </div>
                            <Button color={hasUnissued ? "white" : "accent"} id="generate-new-packs-button" className="mr-3"
                                    onClick={() => this.generateNewPack()} disabled={tenderComplete}>
                                <i className="fas fa-plus-circle mr-1"></i>
                                {hasUnissued ? "Regenerate" : "Generate"} 
                            </Button>
                            <UncontrolledTooltip target="generate-new-packs-button" placement="bottom">
                                <strong>Generate new packs for issuance to suppliers</strong>
                            </UncontrolledTooltip>
                            <Button color="accent" id="issue-packs-button"
                                    disabled={tenderComplete || !hasUnissued}
                                    onClick={() => this.props.openIssueTenderPackDialog({ tender: this.props.tender })}>
                                <i className="fas fa-envelope mr-1"></i>
                                Issue 
                            </Button>
                            <UncontrolledTooltip target="issue-packs-button" placement="bottom">
                                <strong>Issue the below tender packs, via email, to their respective suppliers</strong>
                            </UncontrolledTooltip>
                    </div>
                </CardHeader>
                <CardBody className="p-2">
                    {content}
                </CardBody>
                <IssueTenderPackDialog />
            </Card>
        );
    }


    selectOfferTab(selectedOfferTab: SelectedOfferTab): void {
        this.setState({
            ...this.state,
            selectedOfferTab
        })
    }

    openQuickOffers(isElectricity: boolean){
        this.props.fetchMeterConsumption(this.props.tender.portfolioId, isElectricity ? UtilityType.Electricity : UtilityType.Gas);
        this.props.openQuickOfferDialog({ tender: this.props.tender });
    }

    renderIssuanceOffers(issuance: TenderIssuance, tenderComplete: boolean): JSX.Element {
        var pendingQuotes = issuance.packs.filter((p: TenderPack) => {
            return p.quotes.some((q:TenderQuote) => q.status == "PENDING")
        });
        
        var receivedQuotes = issuance.packs.filter((p: TenderPack) => {
            return p.quotes.every((q:TenderQuote) => q.status != "PENDING")
        });

        var hasReceivedQuotes = receivedQuotes.length != 0;

        let content: JSX.Element | JSX.Element[] = null;
        if(hasReceivedQuotes){
            content = (
                <div>
                    <div className="offers-table-container">
                        {this.renderReceivedOffersTable(receivedQuotes)}
                    </div>
                    {pendingQuotes.length > 0 && (
                        <div>
                            <hr className="my-2"/>
                            {this.renderPendingSuppliers(pendingQuotes)}
                        </div>
                    )}        
                    <ContractRatesDialog />
                </div>)
        }
        else {
            content = this.renderPendingSuppliers(pendingQuotes);
        }

        let { assignedSuppliers, tenderId, utility, halfHourly } = this.props.tender;
        let canQuickQuote = !halfHourly || utility.toLowerCase() === "gas";
        return (
            <Card className="card-small h-100">
                <CardHeader className="border-bottom pl-3 pr-2 py-2">
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex">
                            <h6 className="m-0">
                                <i className="fas fa-handshake mr-1"></i>
                                Offers ({receivedQuotes.SelectMany(tp => tp.quotes).length} received, {pendingQuotes.length} pending)
                                <i className="fas fa-info-circle text-accent pl-2" id="selected-issuance-details-icon"/>
                                <UncontrolledTooltip target="selected-issuance-details-icon" placement="bottom" autohide={false}>
                                    {this.renderIssuanceDetailCard(issuance)}
                                </UncontrolledTooltip>
                            </h6>
                        </div>

                        <div className="d-flex">
                            {canQuickQuote && 
                            <div className="mr-4">
                                <Button color="indigo" id="quick-quote-button"
                                            disabled={tenderComplete}
                                            onClick={() => this.openQuickOffers(utility.toLowerCase() === "electricity")}>
                                    <i className="fas fa-keyboard mr-1"></i>
                                    Quick Offer
                                </Button>
                                <UncontrolledTooltip target="quick-quote-button" placement="bottom">
                                    <strong>Quickly enter values associated with a quote received from a supplier</strong>
                                </UncontrolledTooltip>
                            </div>}

                            <Button color="accent"id="manual-quote-upload-button"
                                        disabled={tenderComplete}
                                        onClick={() => this.props.openUploadOfferDialog({ assignedSuppliers, tenderId, utilityType: utility})}>
                                <i className="fas fa-file-upload mr-1"></i>
                                Upload 
                            </Button>
                            <UncontrolledTooltip target="manual-quote-upload-button" placement="bottom">
                                <strong>Manually upload an offer received from a supplier</strong>
                            </UncontrolledTooltip>
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="p-2">
                    {content}
                    <OfferCollateralDialog />
                    <UploadOfferDialog />
                    <QuickOfferDialog />
                </CardBody>
            </Card>
            )
    }

    renderIssuanceDetailCard(issuance: TenderIssuance) : JSX.Element{
        var supplierCount = issuance.packs.length;
        var lastIssued = this.getFormattedDateTime(issuance.packs[issuance.packs.length - 1].lastIssued);
        var created = this.getFormattedDateTime(issuance.created);
        var expiry = this.getFormattedDateTime(issuance.expiry);

        return (
            <div>
                <h6 className="m-0"><i className="fas fa-industry mr-1 text-indigo"></i> {supplierCount} Suppliers</h6>
                <hr className="my-1"/>
                <div className="text-meta text-left">
                    <i className="fas fa-plug text-accent mr-1"></i>Created:
                </div>
                <h6 className="m-0">{created}</h6>
                <hr className="my-1"/>
                <div className="text-meta text-left">
                    <i className="material-icons text-success mr-1">send</i>Issued:
                </div>
                <h6 className="m-0">{lastIssued}</h6>
                <hr className="my-1"/>
                <div className="text-meta text-left">
                    <i className="fas fa-stopwatch mr-1 text-orange"></i>Expires:
                </div>
                <h6 className="m-0">{expiry}</h6>
            </div>
        )
    }
    
    sortIssuances(issuances: TenderIssuance[]) : TenderIssuance[] {
        return issuances.sort(
            (i1: TenderIssuance, i2: TenderIssuance) => {
                var firstDate = moment.utc(i1.created).unix();
                var secondDate = moment.utc(i2.created).unix();
        
                if (firstDate > secondDate) return -1;
                if (firstDate < secondDate) return 1;
                return 0;
            })
    }

    getIssuanceName(issuance: TenderIssuance, includeSelected?: boolean): JSX.Element {
        let name = moment.utc(issuance.created).local().format("MMMM Do YYYY");
        return (
            <span>
                <i className="fas fa-archive mr-1"></i> {includeSelected && <strong>Selected Issuance: </strong>}<span className="mr-1">{name}</span>
            </span>);
    }

    renderIssuancePicker(issuances: TenderIssuance[], selectedIssuance: TenderIssuance | null): JSX.Element {
        let issuanceOptions: JSX.Element[] = [];

        if(!IsNullOrEmpty(issuances)){
            issuances
            .map((issuance, index) => {
                let { issuanceId } = issuance;
                issuanceOptions.push(
                    <DropdownItem key={issuanceId} href="#" onClick={() => this.selectIssuance(issuanceId)}>
                        {this.getIssuanceName(issuance)}{index === 0 && <span className="text-light">(Latest)</span>}
                    </DropdownItem>);
            });
        }
        
        if(issuanceOptions.length > 0){
            issuanceOptions.push(<DropdownItem key="divider" divider />);
        }

        issuanceOptions.push(
            <DropdownItem key="unissued" href="#" onClick={() => this.selectIssuance("unissued")}><i className="fas fa-drafting-compass mr-1"></i><span className="mr-1">Unissued Packs</span></DropdownItem>
        );

        let selectedTitle = selectedIssuance ? this.getIssuanceName(selectedIssuance, true) : 
            (<span><i className="fas fa-drafting-compass mr-1"></i> <strong>Viewing: </strong><span className="mr-1">Unissued Packs</span></span>);

        return (
            <div className="d-flex">
                <UncontrolledDropdown>
                    <DropdownToggle color="white" caret>
                        {selectedTitle}
                    </DropdownToggle>
                    <DropdownMenu>
                        {issuanceOptions}
                    </DropdownMenu>
                </UncontrolledDropdown>
            </div>
        )
    }
    
    render(){
        if(this.props.working){
            return (<LoadingIndicator />)
        }
        
        let { tender } = this.props;
        if(tender.existingContract == null || tender.existingContract.sheetCount == 0){
            return (
                <div className="w-100">
                    <Alert color="danger">
                        <div className="d-flex align-items-center">
                            <i className="fas fa-exclamation-triangle mr-2"></i>
                            This tender has not yet been matched to an existing contract.
                        </div>
                    </Alert>
                </div>)
        }
        
        let tenderComplete = isComplete(tender);
        let issuances = this.sortIssuances(tender.issuances); 

        let selectedIssuance: TenderIssuance = null;
        if(this.state.selectedIssuanceId != "unissued"){
            selectedIssuance = issuances.find(i => i.issuanceId == this.state.selectedIssuanceId);
            if(!selectedIssuance && !IsNullOrEmpty(issuances)){
                selectedIssuance = issuances.find(i => i != null);
            }
        }

        return (
            <div className="w-100 px-3 py-2">
                <Row noGutters>
                    <Col className="d-flex justify-content-center align-items-center">
                        {this.renderIssuancePicker(issuances, selectedIssuance)}
                    </Col>
                </Row>
                
                <div className="mt-2">
                    {selectedIssuance ? this.renderIssuanceOffers(selectedIssuance, tenderComplete) : this.renderUnissued(tenderComplete)}
                </div>
            </div>);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, TenderOffersTableProps> = (dispatch) => {
    return {
        fetchMeterConsumption: (portfolioId: string, utility: UtilityType) => dispatch(fetchMeterConsumption(portfolioId, utility)),
        fetchQuoteBackingSheets: (tenderId: string, quoteId: string) => dispatch(fetchQuoteBackingSheets(tenderId, quoteId)),
        exportContractRates: (tenderId: string, quoteId: string) => dispatch(exportContractRates(tenderId, quoteId)),
        deleteQuote: (tenderId: string, quoteId: string) => dispatch(deleteQuote(tenderId, quoteId)),
        generateTenderPack: (portfolioId: string, tenderId: string) => dispatch(generateTenderPack(portfolioId, tenderId)),
        
        openAlertDialog: (title: string, body: string) => dispatch(openAlertDialog(title, body)),
        openIssueTenderPackDialog: (data: IssueTenderPackDialogData) => dispatch(openDialog(ModalDialogNames.IssueTenderPack, data)),
        openOfferCollateralDialog: (data: OfferCollateralDialogData) => dispatch(openDialog(ModalDialogNames.ViewOfferCollateral, data)),
        openContractRatesDialog: () => dispatch(openDialog(ModalDialogNames.ContractRates)),
        openUploadOfferDialog: (data: UploadOfferDialogData) => dispatch(openDialog(ModalDialogNames.UploadOffer, data)),
        openQuickOfferDialog: (data: QuickOfferDialogData) => dispatch(openDialog(ModalDialogNames.QuickOffer, data))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, TenderOffersTableProps, ApplicationState> = (state: ApplicationState) => {
    return {
        suppliers: state.suppliers.value,
        working: state.suppliers.working,
        consumption: state.meters.consumption.value
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(TenderOffersTable);