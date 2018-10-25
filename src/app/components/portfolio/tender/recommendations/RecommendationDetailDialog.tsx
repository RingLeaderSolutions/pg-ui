import * as React from "react";
import ErrorMessage from "../../../common/ErrorMessage";
import { MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../../applicationState';
import { format } from 'currency-formatter';
import * as moment from 'moment';
import { fetchRecommendationsSites, deleteRecommendation, fetchRecommendationsSuppliers, fetchRecommendationSummary } from '../../../../actions/tenderActions';

import * as cn from "classnames";
import { Tender, RecommendationSite, RecommendationSupplier, RecommendationSummary, TenderRecommendation, TenderSupplier } from "../../../../model/Tender";
import AsModalDialog, { ModalDialogProps } from "../../../common/modal/AsModalDialog";
import { ModalDialogNames } from "../../../common/modal/ModalDialogNames";
import { LoadingIndicator } from "../../../common/LoadingIndicator";
import { ModalHeader, Navbar, Nav, NavItem, NavLink, ModalBody, ModalFooter, Button, Col, Row, Card, CardHeader, CardBody } from "reactstrap";
import { AlertConfirmDialogData } from "../../../common/modal/AlertConfirmDialog";
import { openAlertConfirmDialog } from "../../../../actions/viewActions";

export interface RecommendationDetailDialogData {
    tender: Tender;
    recommendation: TenderRecommendation;
}

interface StateProps {
    recommendation_summary: RecommendationSummary;
    recommendation_sites: RecommendationSite[];
    recommendation_suppliers: RecommendationSupplier[];
    working: boolean;
    sites_working: boolean;
    error: boolean;
    errorMessage: string;
    suppliers: TenderSupplier[];
}

interface DispatchProps {
    getRecommendationSummary: (tenderId: string, summaryId: string) => void;
    getRecommendationSuppliers: (tenderId: string, summaryId: string) => void;
    getRecommendationSites: (tenderId: string, summaryId: string, siteStart: number, siteEnd: number) => void;
    deleteRecommendation: (tenderId: string, recommendationId: string) => void;
    openAlertConfirmDialog: (data: AlertConfirmDialogData) => void;
}

interface RecommendationDetailDialogState {
    selectedTabIndex: number;
    selectedOfferIndex: number;
    selectedSiteIndex: number;

    currentSiteStart: number;
    currentSiteEnd: number;
}

class RecommendationDetailDialog extends React.Component<ModalDialogProps<RecommendationDetailDialogData> & StateProps & DispatchProps, RecommendationDetailDialogState> {
    constructor(props: ModalDialogProps<RecommendationDetailDialogData> & StateProps & DispatchProps){
        super(props);
        this.state = {
            selectedTabIndex: 0,
            selectedSiteIndex: 0,
            selectedOfferIndex: 0,
            currentSiteStart: 0,
            currentSiteEnd: 4
        }
    }

    componentDidMount(){
        let { recommendation, tender } = this.props.data;

        var siteEnd = 4;
        if(recommendation.meterCount - 1 < siteEnd){
            siteEnd = recommendation.meterCount;
        }

        this.setState({
            ...this.state,
            currentSiteStart: 0,
            currentSiteEnd: siteEnd
        });
        
        this.props.getRecommendationSummary(tender.tenderId, recommendation.summaryId);
        this.props.getRecommendationSuppliers(tender.tenderId, recommendation.summaryId);
        this.props.getRecommendationSites(tender.tenderId, recommendation.summaryId, 0, siteEnd);   
    }

    deleteRecommendation(){
        let { recommendation, tender } = this.props.data;

        this.props.openAlertConfirmDialog({
            body: "Are you sure you want to delete this recommendation report?",
            title: "Confirm Report Deletion",
            confirmIcon: "trash-alt",
            confirmText: "Delete",
            headerClass: "modal-header-danger",
            confirmButtonColor: "danger",
            onConfirm: () => this.props.deleteRecommendation(tender.tenderId, recommendation.summaryId)
         });
    }

    canGetNextSites() : boolean{
        var maxSitePosition = this.props.data.recommendation.meterCount - 1;
        // If we're already at the end, we can't go any further forward
        if(this.state.currentSiteEnd == maxSitePosition){
            return false;
        }
        return true;
    }

    canGetPreviousSites(): boolean {
        // If we're at the beginning, we can't go any further back
        if(this.state.currentSiteStart == 0){
            return false;
        }
        return true;
    }

    getPreviousSites(){
        var siteStart = this.state.currentSiteStart - 5;
        var siteEnd = this.state.currentSiteStart - 1;

        if(siteStart < 0){
            siteStart = 0;
        }

        this.props.getRecommendationSites(this.props.data.tender.tenderId, this.props.recommendation_summary.summaryId, siteStart, siteEnd);
        
        this.setState({
            ...this.state,
            currentSiteStart: siteStart,
            currentSiteEnd: siteEnd,
        });
    }

    getNextSites(){
        var siteStart = this.state.currentSiteEnd + 1;
        var siteEnd = this.state.currentSiteEnd + 5;

        var maxSitePosition = this.props.data.recommendation.meterCount - 1;
        if(siteStart > maxSitePosition){
            siteStart = this.state.currentSiteEnd + 1;
        }
        if(siteEnd > maxSitePosition){
            siteEnd = maxSitePosition;
        }

        this.props.getRecommendationSites(this.props.data.tender.tenderId, this.props.recommendation_summary.summaryId, siteStart, siteEnd);
        
        this.setState({
            ...this.state,
            currentSiteStart: siteStart,
            currentSiteEnd: siteEnd,
        });
    }

    renderSiteTabContent(recommendationSite: RecommendationSite){
        var receivedOfferRows = recommendationSite.siteOffersList.map(ru => {
            var supplier = this.props.suppliers.find(su => su.supplierId == ru.supplierId);
            var supplierText = supplier == null ? "Unknown" : (<img src={supplier.logoUri} style={{ maxWidth: "70px", maxHeight: "40px"}}/>);

            var previousDiffPercentage = ru.previousPercentageDifference * 100;
            var adriftPercentage = ru.adriftPercentage * 100;
            var isWinningOffer = ru.winner;
            return (
                <tr key={ru.ranking}>
                    {isWinningOffer ? 
                        (
                            <td>
                                <i className="fa fa-trophy mr-1 fa-xs" style={{color: 'goldenrod'}}></i>#{ru.ranking + 1}
                            </td>
                        )
                        : (<td>{`#${ru.ranking + 1}`}</td>)}
                    <td>{supplierText}</td>
                    <td>{`${ru.duration}M`}</td>
                    <td>{format(ru.totalIncCCL, { locale: 'en-GB'})}</td>
                    <td>{format(ru.cclCost, { locale: 'en-GB'})}</td>
                    <td>{`${ru.appu.toFixed(4)}p`}</td>
                    {this.renderCostCell(ru.previousAmountDifference, format(ru.previousAmountDifference, { locale: 'en-GB'}))}
                    {this.renderCostCell(previousDiffPercentage, `${previousDiffPercentage.toFixed(2)}%`)}
                    {isWinningOffer ? (<td>-</td>) : this.renderCostCell(ru.adriftAmount, format(ru.adriftAmount, { locale: 'en-GB'}))}
                    {isWinningOffer ? (<td>-</td>) : this.renderCostCell(adriftPercentage, `${adriftPercentage.toFixed(2)}%`)}
                </tr>
            )
        })

        var billingRatesRows = recommendationSite.recommendedBillingRates.yearlyRates.map((yearlyRate, index) => {
            if(yearlyRate.total){
                return (
                    <tr key={index}>
                        <td />
                        <td />
                        <td />
                        <td><strong>Total</strong></td>
                        <td><strong>{yearlyRate.uom}{yearlyRate.formattedAmount}</strong></td>
                        <td></td>
                    </tr>
                )
            }
            var monthlyRate = recommendationSite.recommendedBillingRates.monthlyRates[index];
            return (
                <tr key={index}>
                    <td>{monthlyRate.title}</td>
                    <td>{monthlyRate.formattedAmount}</td>
                    <td>{monthlyRate.uom}</td>
                    <td></td>
                    <td>{yearlyRate.formattedAmount}</td>
                    <td>{yearlyRate.uom}</td>
                </tr>
            )
        })

        var percentageChangeContent = this.renderPercentageChangeCard(recommendationSite.recommendedSiteOffer.percentageChange);
        var currentSupplier = this.props.suppliers.find(su => su.supplierId == recommendationSite.currentContract.supplierId);
        var currentSupplierText = currentSupplier == null ? (<h4><strong>Unknown</strong></h4>) : (<img src={currentSupplier.logoUri} style={{ maxHeight: "30px"}}/>);

        var newSupplier = this.props.suppliers.find(su => su.supplierId == recommendationSite.recommendedSiteOffer.supplierId);
        var newSupplierText = newSupplier == null ? (<h4><strong>Unknown</strong></h4>) : (<img src={newSupplier.logoUri} style={{ maxHeight: "30px"}}/>);

        var startDate = moment.utc(recommendationSite.recommendedSiteOffer.startDate).local().format("DD/MM/YYYY");
        var endDate = moment.utc(recommendationSite.recommendedSiteOffer.endDate).local().format("DD/MM/YYYY");

        return (
            <div className="bg-body d-flex flex-column py-2 px-3">
                <Row className="mb-3" noGutters>
                    <Card className="card-small h-100 w-100">
                        <CardBody className="p-0 d-flex flex-column">
                            <Row className="p-2 d-flex" noGutters>
                                <Col xs={3} className="d-flex flex-column justify-content-center text-center px-1 mt-md-0 mt-3">
                                    <h5 className="m-0 flex-grow-1 d-flex justify-content-center align-items-center">{recommendationSite.siteCode}</h5>
                                    <div className="text-light pt-1">Site Code</div>
                                </Col>
                                <Col xs={3} className="d-flex flex-column justify-content-center text-center border-left px-1 mt-md-0 mt-3">
                                    <h5 className="m-0 flex-grow-1 d-flex justify-content-center align-items-center">{recommendationSite.siteName}</h5>
                                    <div className="text-light pt-1">Site Name</div>
                                </Col>
                                <Col xs={3} className="d-flex flex-column justify-content-center text-center border-left px-1 mt-md-0 mt-3">
                                    <h5 className="m-0 flex-grow-1 d-flex justify-content-center align-items-center">{recommendationSite.billingAddress}</h5>
                                    <div className="text-light pt-1">Billing Address</div>
                                </Col>
                                <Col xs={3} className="d-flex flex-column justify-content-center text-center border-left px-1 mt-md-0 mt-3">
                                    <h5 className="m-0 flex-grow-1 d-flex justify-content-center align-items-center">{recommendationSite.supplierAddress}</h5>
                                    <div className="text-light pt-1">Supply Address</div>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Row>
                <Row className="mb-3" noGutters>
                    <Card className="card-small h-100 w-100">
                        <CardHeader className="border-bottom pl-3 pr-2 py-2">
                            <div className="d-flex align-items-center">
                                <div className="flex-grow-1">
                                    <h6 className="m-0"><i className="fas fa-file-signature mr-1"></i>Existing Contract</h6>
                                </div>
                            </div>
                        </CardHeader>
                        <CardBody className="p-0 d-flex flex-column">
                            <Row className="p-2 pt-3" noGutters>
                                <Col xs={3} className="d-flex flex-column justify-content-center text-center px-1 mt-md-0 mt-3">
                                    <h5 className="m-0 flex-grow-1 d-flex justify-content-center">{currentSupplierText}</h5>
                                    <div className="text-light pt-1"><i className="fas fa-industry mr-1 text-indigo"></i>Supplier</div>
                                </Col>
                                <Col xs={3} className="d-flex flex-column justify-content-center text-center border-left px-1 mt-md-0 mt-3">
                                    <h4 className="m-0 flex-grow-1 d-flex justify-content-center"><strong>{format(recommendationSite.currentContract.totalIncCCL, { locale: 'en-GB'})}</strong></h4>
                                    <div className="text-light pt-1"><i className="fas fa-money-check-alt mr-2 text-accent"></i>Comparative Total Inc CCL</div>
                                </Col>
                                <Col xs={3} className="d-flex flex-column justify-content-center text-center border-left px-1 mt-md-0 mt-3">
                                    <h4 className="m-0 flex-grow-1 d-flex justify-content-center"><strong>{format(recommendationSite.currentContract.ccl, { locale: 'en-GB'})} </strong></h4>
                                    <div className="text-light pt-1"><i className="fas fa-leaf mr-2 text-success"></i>CCL</div>
                                </Col>
                                <Col xs={3} className="d-flex flex-column justify-content-center text-center border-left px-1 mt-md-0 mt-3">
                                    <h4 className="m-0 flex-grow-1 d-flex justify-content-center"><strong>{`${recommendationSite.currentContract.appu.toFixed(4)}p`}</strong></h4>
                                    <div className="text-light pt-1"><i className="fas fa-coins mr-1 text-warning mr-2"></i>Avg Pence Per Unit</div>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Row>
                <Row className="mb-3" noGutters>
                    <Card className="card-small h-100 w-100">
                        <CardHeader className="border-bottom pl-3 pr-2 py-2">
                            <div className="d-flex align-items-center">
                                <div className="flex-grow-1">
                                    <h6 className="m-0"><i className="fa fa-trophy mr-1 fa-xs" style={{color: 'goldenrod'}}></i>Recommended Offer</h6>
                                </div>
                            </div>
                        </CardHeader>
                        <CardBody className="p-0 d-flex flex-column">
                            <Row className="p-2 pt-3" noGutters>
                                <Col xs={3} className="d-flex flex-column justify-content-center text-center px-1 mt-md-0 mt-3">
                                    <h5 className="m-0 flex-grow-1 d-flex justify-content-center">{newSupplierText}</h5>
                                    <div className="text-light pt-1"><i className="fas fa-industry mr-1 text-indigo"></i>New Supplier</div>
                                </Col>
                                <Col xs={3} className="d-flex flex-column justify-content-center text-center border-left px-1 mt-md-0 mt-3">
                                    <h4 className="m-0 flex-grow-1 d-flex justify-content-center"><strong>{format(recommendationSite.recommendedSiteOffer.totalIncCCL, { locale: 'en-GB'})}</strong></h4>
                                    <div className="text-light pt-1"><i className="fas fa-money-check-alt mr-2 text-accent"></i>Annual cost Inc CCL</div>
                                </Col>
                                <Col xs={3} className="d-flex flex-column justify-content-center text-center border-left px-1 mt-md-0 mt-3">
                                    <h5 className="m-0 flex-grow-1 d-flex justify-content-center">{percentageChangeContent}</h5>
                                    <div className="text-light pt-1"><i className="fas fa-percent mr-2 text-success"></i>Change</div>
                                </Col>
                                <Col xs={3} className="d-flex flex-column justify-content-center text-center border-left px-1 mt-md-0 mt-3">
                                    <h5 className="m-0 flex-grow-1 d-flex justify-content-center">{`${recommendationSite.recommendedSiteOffer.paymentTerms} days`}</h5>
                                    <div className="text-light pt-1"><i className="fas fa-receipt mr-1 text-indigo mr-2"></i>Payment Terms</div>
                                </Col>
                            </Row>
                            <Row noGutters className="d-block">
                                <hr />
                            </Row>
                            <Row className="p-2" noGutters>
                                <Col xs={4} className="d-flex flex-column justify-content-center text-center px-1 mt-md-0 mt-3">
                                    <h5 className="m-0 flex-grow-1 d-flex justify-content-center">{startDate}</h5>
                                    <div className="text-light pt-1"><i className="fas fa-play mr-1"></i>Start Date</div>
                                </Col>
                                <Col xs={4} className="d-flex flex-column justify-content-center text-center border-left px-1 mt-md-0 mt-3">
                                    <h5 className="m-0 flex-grow-1 d-flex justify-content-center">{endDate}</h5>
                                    <div className="text-light pt-1"><i className="fas fa-pause mr-1"></i>End Date</div>
                                </Col>
                                <Col xs={4} className="d-flex flex-column justify-content-center text-center border-left px-1 mt-md-0 mt-3">
                                    <h5 className="m-0 flex-grow-1 d-flex justify-content-center">{recommendationSite.recommendedSiteOffer.fuelType || "-"} </h5>
                                    <div className="text-light pt-1"><i className="fas fa-info mr-2"></i>Fuel Type</div>
                                </Col>
                            </Row>
                            <Row noGutters className="d-block">
                                <hr />
                            </Row>
                            <Row noGutters className="border-bottom"><h6><strong><i className="fas fa-pound-sign mr-1 pl-3"></i>Contract Rates</strong></h6></Row>
                            <Row noGutters className="d-flex flex-column justify-content-center align-items-center bg-body pb-1">
                                <table className="table" style={{width: 'auto'}}>
                                    <thead>
                                        <tr>
                                            <th>Monthly / Quarterly Charges</th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th>Annual Charges</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {billingRatesRows}
                                    </tbody>
                                </table>
                            </Row>
                        </CardBody>
                    </Card>
                </Row>
                <Row className="mb-1" noGutters>
                    <Card className="card-small h-100 w-100">
                        <CardHeader className="border-bottom pl-3 pr-2 py-2">
                            <div className="d-flex align-items-center">
                                <div className="flex-grow-1">
                                    <h6 className="m-0"><i className="fas fa-file-signature mr-1"></i>Existing Contract</h6>
                                </div>
                            </div>
                        </CardHeader>
                        <CardBody className="p-0 d-flex flex-column">
                            <table className="table table">
                                <thead>
                                    <tr>
                                        <th>Ranking</th>
                                        <th>Supplier</th>
                                        <th>Duration</th>
                                        <th>Annual Cost inc CCL</th>
                                        <th>CCL</th>
                                        <th>Average pence per unit</th>
                                        <th>£ Increase or Saving (-)</th>
                                        <th>% Increase or Saving (-)</th>
                                        <th>£ Adrift</th>
                                        <th>% Adrift</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {receivedOfferRows}
                                </tbody>
                            </table>
                        </CardBody>
                    </Card>
                </Row>
            </div>);
    }

    renderSiteTabs() {
        if(this.props.sites_working || !this.props.recommendation_sites){
            return (<LoadingIndicator text="Loading sites..." />);
        }

        let selectedSiteIndex = this.state.selectedSiteIndex;
        let selectedSite = this.props.recommendation_sites[selectedSiteIndex];

        var previousIsDisabled = !this.canGetPreviousSites();
        var nextIsDisabled = !this.canGetNextSites();
        return (
            <div>
                <Navbar className="p-0 bg-white d-flex border-bottom">
                    <div className="flex-grow-1 d-flex justify-content-start pl-2">
                        <Button color="white" disabled={previousIsDisabled}>
                            <i className="fas fa-chevron-left" />
                        </Button>
                    </div>
                    <Nav tabs className="justify-content-center flex-grow-1 px-3 border-bottom-0">
                        {this.props.recommendation_sites.map((rs, index) => {
                            return (
                                <NavItem key={index}>
                                    <NavLink className={cn({ active: selectedSiteIndex === index})}
                                            onClick={() => this.selectSiteTab(index)}
                                            href="#">
                                            {rs.siteCode}
                                    </NavLink>
                                </NavItem>);
                        })}
                    </Nav>
                    <div className="flex-grow-1 d-flex justify-content-end pr-2">
                        <Button color="white" disabled={nextIsDisabled}>
                            <i className="fas fa-chevron-right" />
                        </Button>
                    </div>
                </Navbar>
                <div>
                    {this.renderSiteTabContent(selectedSite)}
                </div>
            </div>);
    }

    renderOffersTab(){   
        let selectedOfferIndex = this.state.selectedOfferIndex;
        let selectedOffer = this.props.recommendation_suppliers[selectedOfferIndex];
        
        var backingSheetsContent = selectedOffer.backingsheets.map((bs, index) => {
            var bsFields = bs.map((f,findex) => (<td key={findex}>{f}</td>));
            return (<tr key={index}>{bsFields}</tr>)
        });

        var backingSheetsHeaders = selectedOffer.backingsheetTitles.map((bst, index) => {
            return (<th className="text-capitalize" key={index}>{bst}</th>)
        });

        return (
            <div>
                <Navbar className="p-0 bg-white">
                    <Nav tabs className="flex-grow-1 px-3">
                        {this.props.recommendation_suppliers.map((rs, index) => {
                            return (
                                <NavItem key={index}>
                                    <NavLink className={cn({ active: selectedOfferIndex === index})}
                                            onClick={() => this.selectOfferTab(index)}
                                            href="#">
                                        {rs.winner && (<i className="fa fa-trophy mr-1" style={{color: 'goldenrod'}}></i>)}
                                        {rs.incumbentContract ? (<span>{rs.supplierName} (Incumbent)</span>) : <span>{rs.supplierName} ({rs.duration}m V{rs.version})</span>}
                                    </NavLink>
                                </NavItem>
                            )
                        })}
                    </Nav>
                </Navbar>
                <div className="w-100 bg-white">
                    <table className="table">
                        <thead>
                            <tr>{backingSheetsHeaders}</tr>
                        </thead>
                        <tbody>
                            {backingSheetsContent}
                        </tbody>
                    </table>
                </div>
            </div>);
    }
    renderPercentageChangeCard(value: number){
        var formattedValue = `${(value * 10).toFixed(2)}%`;
        if(value == 0){
            return (<h4><strong>{formattedValue}</strong></h4>)
        }
        if(value < 0){
            return <h4 style={{color: "darkgreen"}}>{formattedValue} <i className="fas fa-caret-down" style={{color: 'green'}}></i></h4>
        }
        return <h4 style={{color: "darkred"}}>{formattedValue} <i className="fas fa-caret-up" style={{color: 'red'}}></i></h4>
    }

    renderCostCell(value: number, formattedValue: string){
        if(value == 0){
            return <td style={{backgroundColor: "#fffef0", color: "burlywood"}}>{formattedValue}</td>
        }
        if(value < 0){
            return <td style={{backgroundColor: "#f0fff0", color: "darkgreen"}}>{formattedValue} <i className="fas fa-caret-down" style={{color: 'green'}}></i></td>
        }
        return <td style={{backgroundColor: "#fff0f4", color: "darkred"}}>{formattedValue} <i className="fas fa-caret-up" style={{color: 'red'}}></i></td>
    }

    renderSummaryTab(){
        var selectedRecommendation = this.props.data.recommendation;
        var summary = this.props.recommendation_summary;
        var created = moment.utc(summary.reportDate).local().fromNow();   
        var communicated = selectedRecommendation.communicated == null ? "Never" : moment.utc(selectedRecommendation.communicated).local().fromNow();   

        var offerSummaries = summary.offerSummaries.map(os => {
            var percentageDifference = (os.previousPercentageDifference * 100);
            var adriftPercentage = (os.adriftPercentage * 100);

            var supplier = this.props.suppliers.find(su => su.supplierId == os.supplierId);
            var supplierText = supplier == null ? "Unknown" : (<img src={supplier.logoUri} style={{ maxWidth: "70px", maxHeight: "40px"}}/>);

            return (
                <tr key={os.ranking}>
                        {os.winner ? 
                        (
                            <td>
                                <i className="fa fa-trophy mr-1 fa-xs" style={{color: 'goldenrod'}}></i>#{os.ranking + 1}
                            </td>
                        )
                        : (<td>{`#${os.ranking + 1}`}</td>)}
                    <td>{supplierText} (V{os.version})</td>
                    <td>{os.duration}M</td>
                    <td>{format(os.totalIncCCL, { locale: 'en-GB'})}</td>
                    <td>{format(os.cclCost, { locale: 'en-GB'})}</td>
                    <td>{`${summary.existingAPPU.toFixed(4)}p`}</td>
                    {this.renderCostCell(os.previousAmountDifference, format(os.previousAmountDifference, { locale: 'en-GB'}))}
                    {this.renderCostCell(percentageDifference, `${percentageDifference.toFixed(2)}%`)}
                    {os.winner ? (<td>-</td>) : this.renderCostCell(os.adriftAmount, format(os.adriftAmount, { locale: 'en-GB'}))}
                    {os.winner ? (<td>-</td>) : this.renderCostCell(adriftPercentage, `${adriftPercentage.toFixed(2)}%`)}
                </tr>)
        })

        var existingSupplier = this.props.suppliers.find(su => su.supplierId == summary.existingSupplierId);
        var existingSupplierText = existingSupplier == null ? (<h4><strong>Unknown</strong></h4>) : (<img src={existingSupplier.logoUri} style={{ maxHeight: "30px"}}/>);
        
        return (
            <div className="bg-body d-flex flex-column py-2 px-3">
                <Row className="mb-3" noGutters>
                    <Card className="card-small h-100 w-100">
                        <CardBody className="p-0 d-flex flex-column">
                            <Row className="px-2 pt-3 d-flex" noGutters>
                                <Col xs={4} className="d-flex flex-column justify-content-center text-center px-1 mt-md-0 mt-3">
                                    <h5 className="m-0 flex-grow-1 d-flex justify-content-center align-items-center">{summary.tenderId.substr(0, 6)}</h5>
                                    <div className="text-light pt-1"><i className="fas fa-bookmark text-primary mr-1"></i>Tender Reference</div>
                                </Col>
                                <Col xs={4} className="d-flex flex-column justify-content-center text-center border-left px-1 mt-md-0 mt-3">
                                    <h5 className="m-0 flex-grow-1 d-flex justify-content-center align-items-center">{summary.tenderTitle}</h5>
                                    <div className="text-light pt-1"><i className="fas fa-list mr-1"></i>Tender Title</div>
                                </Col>
                                <Col xs={4} className="d-flex flex-column justify-content-center text-center border-left px-1 mt-md-0 mt-3">
                                    <h5 className="m-0 flex-grow-1 d-flex justify-content-center align-items-center">{created}</h5>
                                    <div className="text-light pt-1"><i className="fas fa-bullhorn mr-1 text-accent"></i>Report Created</div>
                                </Col>
                            </Row>
                            <Row noGutters className="d-block">
                                <hr />
                            </Row>
                            <Row className="p-2 pb-3" noGutters>
                                <Col xs={4} className="d-flex flex-column justify-content-center text-center px-1 mt-md-0 mt-3">
                                    <h5 className="m-0 flex-grow-1 d-flex justify-content-center">{summary.clientName}</h5>
                                    <div className="text-light pt-1"><i className="fas fa-building mr-1 text-indigo"></i>Client</div>
                                </Col>
                                <Col xs={4} className="d-flex flex-column justify-content-center text-center border-left px-1 mt-md-0 mt-3">
                                    <h5 className="m-0 flex-grow-1 d-flex justify-content-center">{summary.attentionOf}</h5>
                                    <div className="text-light pt-1"><i className="fas fa-user mr-1 text-indigo"></i>Client Contact</div>
                                </Col>
                                <Col xs={4} className="d-flex flex-column justify-content-center text-center border-left px-1 mt-md-0 mt-3">
                                    <h5 className="m-0 flex-grow-1 d-flex justify-content-center">{communicated}</h5>
                                    <div className="text-light pt-1"><i className="material-icons mr-1 text-success">send</i>Last Sent</div>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Row>
                <Row className="mb-3" noGutters>
                    <Card className="card-small h-100 w-100">
                        <CardHeader className="border-bottom pl-3 pr-2 py-2">
                            <div className="d-flex align-items-center">
                                <div className="flex-grow-1">
                                    <h6 className="m-0"><i className="fas fa-file-signature mr-1"></i>Existing Contract</h6>
                                </div>
                            </div>
                        </CardHeader>
                        <CardBody className="p-0 d-flex flex-column">
                            <Row className="p-2 pt-3" noGutters>
                                <Col xs={4} className="d-flex flex-column justify-content-center text-center px-1 mt-md-0 mt-3">
                                    <h5 className="m-0 flex-grow-1 d-flex justify-content-center">{existingSupplierText}</h5>
                                    <div className="text-light pt-1"><i className="fas fa-industry mr-1 text-indigo"></i>Supplier</div>
                                </Col>
                                <Col xs={4} className="d-flex flex-column justify-content-center text-center border-left px-1 mt-md-0 mt-3">
                                    <h5 className="m-0 flex-grow-1 d-flex justify-content-center">{format(summary.existingtotalIncCCL, { locale: 'en-GB'})}</h5>
                                    <div className="text-light pt-1"><i className="fas fa-money-check-alt mr-2 text-accent"></i>Total Inc CCL</div>
                                </Col>
                                <Col xs={4} className="d-flex flex-column justify-content-center text-center border-left px-1 mt-md-0 mt-3">
                                    <h5 className="m-0 flex-grow-1 d-flex justify-content-center">{`${summary.existingAPPU.toFixed(4)}p`}</h5>
                                    <div className="text-light pt-1"><i className="fas fa-coins mr-1 text-warning mr-2"></i>Avg Pence Per Unit</div>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Row>
                <Row className="mb-2" noGutters>
                    <Card className="card-small h-100 w-100">
                        <CardHeader className="border-bottom pl-3 pr-2 py-2">
                            <div className="d-flex align-items-center">
                                <div className="flex-grow-1">
                                    <h6 className="m-0"><i className="fas fa-handshake mr-1"></i>Offers Received</h6>
                                </div>
                            </div>
                        </CardHeader>
                        <CardBody className="p-0 d-flex flex-column">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Rank</th>
                                        <th></th>
                                        <th>Duration</th>
                                        <th>Total Inc CCL</th>
                                        <th>CCL</th>
                                        <th>Avg Pence / kWh</th>
                                        <th>£ Increase or Saving</th>
                                        <th>% Increase or Saving</th>
                                        <th>£ Adrift</th>
                                        <th>% Adrift</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {offerSummaries}
                                </tbody>
                            </table>
                        </CardBody>
                    </Card>
                </Row>
            </div>)
    }

    selectTab(tabIndex: number){
        this.setState({
            ...this.state,
            selectedTabIndex: tabIndex
        });
    }

    selectOfferTab(index: number){
        this.setState({
            ...this.state,
            selectedOfferIndex: index
        });
    }

    selectSiteTab(index: number){
        this.setState({
            ...this.state,
            selectedSiteIndex: index
        });
    }

    render() {
        if(this.props.error){
            return (<ErrorMessage content={this.props.errorMessage} />);
        }
        if(this.props.working || !this.props.recommendation_suppliers || !this.props.recommendation_summary){
            return (<LoadingIndicator text="Loading Recommendation Report..." />);
        }

        return (
            <div className="modal-content">
                <ModalHeader toggle={this.props.toggle}><i className="fas fa-bullhorn mr-2" />Recommendation Report: {this.props.recommendation_summary.clientName}</ModalHeader>
                <Navbar className="p-0 bg-white">
                    <Nav tabs className="justify-content-center flex-grow-1">
                        <NavItem>
                            <NavLink className={cn({ active: this.state.selectedTabIndex === 0})}
                                    onClick={() => this.selectTab(0)}
                                    href="#">
                                <i className="fa fa-list-alt"></i>Summary
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className={cn({ active: this.state.selectedTabIndex === 1}, "ml-2")}
                                        onClick={() => this.selectTab(1)}
                                        href="#">
                                <i className="fas fa-handshake"></i>Offers
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className={cn({ active: this.state.selectedTabIndex === 2}, "ml-2")}
                                        onClick={() => this.selectTab(2)}
                                        href="#">
                                <i className="fas fa-store"></i>Sites
                            </NavLink>
                        </NavItem>
                    </Nav>
                </Navbar>
                <ModalBody className="p-0" style={{overflowY: 'auto'}}>
                    {this.state.selectedTabIndex === 0 && this.renderSummaryTab()}
                    {this.state.selectedTabIndex === 1 && this.renderOffersTab()}
                    {this.state.selectedTabIndex === 2 && this.renderSiteTabs()}
                </ModalBody>
                <ModalFooter className="justify-content-between">
                    <Button color="danger"
                        onClick={() => this.deleteRecommendation()}>
                        <i className="fas fa-trash-alt mr-1" />Delete
                    </Button>
                    <Button color="accent" 
                            href={this.props.data.recommendation.summaryFileName}>
                        <i className="fas fa-file-download mr-1"></i>Download
                    </Button>
                    <Button onClick={this.props.toggle}>
                        <i className="fas fa-check mr-1"></i>OK
                    </Button>
                </ModalFooter>
            </div>);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => {
    return {
        deleteRecommendation: (tenderId: string, recommendationId: string) => dispatch(deleteRecommendation(tenderId, recommendationId)),
        
        getRecommendationSummary:  (tenderId: string, summaryId: string)  => dispatch(fetchRecommendationSummary(tenderId, summaryId)),
        getRecommendationSuppliers:  (tenderId: string, summaryId: string)  => dispatch(fetchRecommendationsSuppliers(tenderId, summaryId)),
        getRecommendationSites: (tenderId: string, summaryId: string, siteStart: number, siteEnd: number) => dispatch(fetchRecommendationsSites(tenderId, summaryId, siteStart, siteEnd)),

        openAlertConfirmDialog: (data: AlertConfirmDialogData) => dispatch(openAlertConfirmDialog(data))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, {}, ApplicationState> = (state: ApplicationState) => {
    return {
        recommendation_summary: state.portfolio.tender.selected_recommendation_summary.value,
        recommendation_suppliers: state.portfolio.tender.selected_recommendation_suppliers.value,
        recommendation_sites: state.portfolio.tender.selected_recommendation_sites.value,
        sites_working: state.portfolio.tender.selected_recommendation_sites.working,
        working: state.portfolio.tender.selected_recommendation_summary.working || state.portfolio.tender.selected_recommendation_suppliers.working,
        error: state.portfolio.tender.selected_recommendation_summary.error || state.portfolio.tender.selected_recommendation_suppliers.error || state.portfolio.tender.selected_recommendation_sites.error,
        errorMessage: state.portfolio.tender.selected_recommendation_summary.errorMessage || state.portfolio.tender.selected_recommendation_suppliers.errorMessage || state.portfolio.tender.selected_recommendation_sites.errorMessage,
        suppliers: state.suppliers.value
    };
};

export default AsModalDialog<RecommendationDetailDialogData, StateProps, DispatchProps>(
{ 
    name: ModalDialogNames.RecommendationDetail, 
    centered: true, 
    backdrop: true,
    size: "full"
}, mapStateToProps, mapDispatchToProps)(RecommendationDetailDialog)