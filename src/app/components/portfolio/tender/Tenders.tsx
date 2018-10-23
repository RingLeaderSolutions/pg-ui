import * as React from "react";
import ErrorMessage from "../../common/ErrorMessage";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { Portfolio, PortfolioDetails, UtilityType } from '../../../model/Models';

import { getPortfolioTenders, fetchTenderOffers, fetchTenderRecommendations } from '../../../actions/tenderActions';
import { Tender } from "../../../model/Tender";
import { selectTender, openDialog, selectTenderTab } from "../../../actions/viewActions";
import CreateTenderDialog, { CreateTenderDialogData } from "./creation/CreateTenderDialog";
import { TenderUtilityIconTabHeader, UtilityIcon } from "../../common/UtilityIcon";
import { fetchMeterConsumption } from "../../../actions/meterActions";
import { MeterConsumptionSummary } from "../../../model/Meter";
import * as cn from "classnames";
import { DropdownItem, UncontrolledDropdown, DropdownToggle, Row, DropdownMenu, Navbar, NavItem, Nav, NavLink, Col, Alert } from "reactstrap";
import moment = require("moment");
import TenderDeadlineWarning from "./warnings/TenderDeadlineWarning";
import TenderStatus from "./TenderStatus";
import TenderContractView from "./TenderContractView";
import TenderOffersTable from "./offers/TenderOffersTable";
import TenderRecommendationsList from "./recommendations/TenderRecommendationsList";
import { TenderCompleteWarning } from "./warnings/TenderCompleteWarning";
import { LoadingIndicator } from "../../common/LoadingIndicator";
import { ModalDialogNames } from "../../common/modal/ModalDialogNames";
import UpdateTenderDialog from "./creation/UpdateTenderDialog";
import { IsNullOrEmpty } from "../../../helpers/extensions/ArrayExtensions";

interface TendersProps {
    portfolio: Portfolio;
}

interface StateProps {
    tenders: Tender[];
    offers: Tender[];
    recommendations: Tender[];
    details: PortfolioDetails;
    consumption: MeterConsumptionSummary;
    
    working: boolean;
    error: boolean;
    errorMessage: string;
    selectedTenderIndex: number;
    selectedTenderTabIndex: number;
}


interface DispatchProps {
    getPortfolioTenders: (portfolioId: string) => void;
    getPortfolioOffers: (portfolioId: string) => void;
    getPortfolioRecommendations: (portfolioId: string) => void;
    fetchMeterConsumption: (portfolioId: string) => void;    

    selectTender: (index: number) => void;
    selectTenderTab: (index: number) => void;

    openCreateTenderDialog: (data: CreateTenderDialogData) => void;
}

class Tenders extends React.Component<TendersProps & StateProps & DispatchProps, {}> {
    componentDidMount(){
        let portfolioId = this.props.portfolio.id;     

        this.props.getPortfolioTenders(portfolioId);
        this.props.getPortfolioOffers(portfolioId);
        this.props.getPortfolioRecommendations(portfolioId);

        this.props.fetchMeterConsumption(portfolioId);      
    }
    
    renderSelectedTender(selectedTender: Tender): JSX.Element {
        let utility = selectedTender.utility.toLowerCase() == "gas" ? UtilityType.Gas : UtilityType.Electricity;
        let selectedTenderOffers = this.props.offers.find(ot => ot.tenderId === selectedTender.tenderId);
        let selectedTenderRecommendations = this.props.recommendations.find(rt => rt.tenderId === selectedTender.tenderId);

        return (
            <div>
                {/* Navigation */}
                <Navbar className="p-0 bg-white border-top">
                    <Nav tabs className="justify-content-center flex-grow-1">
                        <NavItem>
                            <NavLink className={cn({ active: this.props.selectedTenderTabIndex === 0})}
                                    onClick={() => this.props.selectTenderTab(0)}
                                    href="#">
                                <i className="fa fa-list"></i>Details
                            </NavLink>
                        </NavItem>
                        <NavItem className="ml-md-3 ml-sm-1">
                            <NavLink className={cn({ active: this.props.selectedTenderTabIndex === 1})}
                                        onClick={() => this.props.selectTenderTab(1)}
                                        href="#">
                                <i className="fas fa-handshake"></i>Offers
                            </NavLink>
                        </NavItem>
                        <NavItem className="ml-md-3 ml-sm-1">
                            <NavLink className={cn({ active: this.props.selectedTenderTabIndex === 2 }, "mr-0")}
                                    onClick={() => this.props.selectTenderTab(2)}
                                    href="#">
                                <i className="fas fa-bullhorn"></i>Recommendations
                            </NavLink>
                        </NavItem>
                    </Nav>
                </Navbar>

                {/* Tender Deadline / Complete warnings, shown above all content */}
                <TenderDeadlineWarning deadline={moment(selectedTender.deadline)} className="py-1" />
                <TenderCompleteWarning tender={selectedTender} className="py-1" />

                {/* Selected tab content */}
                {this.props.selectedTenderTabIndex === 0 && (
                    <div className="w-100">
                        <TenderStatus tender={selectedTender} utility={utility} details={this.props.details} />
                        <TenderContractView tender={selectedTender} portfolio={this.props.details.portfolio}/>
                    </div>
                )}

                {this.props.selectedTenderTabIndex === 1 && (
                    <TenderOffersTable tender={selectedTenderOffers} />
                )}

                {this.props.selectedTenderTabIndex === 2 && (
                    <TenderRecommendationsList tender={selectedTenderRecommendations} />
                )}       
            </div>);
    }
    
    checkHasMeters(tenderTypeIndex: number){
        var meterDetails = this.props.consumption;
        var hasElectricityMeters = meterDetails.electrictyConsumptionEntries.length > 0;
        switch(tenderTypeIndex){
            case 0:
                return hasElectricityMeters && meterDetails.electrictyConsumptionEntries.filter(arr => arr[2] == "HH").length > 0;
            case 1:
                return hasElectricityMeters && meterDetails.electrictyConsumptionEntries.filter(arr => arr[2] == "NHH").length > 0;
            case 2:
                return meterDetails.gasConsumptionEntries.length > 0;
            default:
                throw new RangeError(`No valid tender type for index [${tenderTypeIndex}]`);
        }
    }

    getCreationOptions(hh: Tender, nhh: Tender, gas: Tender) : JSX.Element[]{
        let options: JSX.Element[] = [];

        if(!hh && this.checkHasMeters(0)) {
            options.push(
                <DropdownItem key="hh" href="#" onClick={() => this.props.openCreateTenderDialog({ isHalfHourly: true, portfolioId: this.props.portfolio.id, utility: UtilityType.Electricity })}>
                    <UtilityIcon utility="hh" iconClass="mr-1">HH Electricity</UtilityIcon>
                </DropdownItem>);
        }
        if(!nhh && this.checkHasMeters(1)){
            options.push(
                <DropdownItem key="nhh" href="#" onClick={() => this.props.openCreateTenderDialog({ isHalfHourly: false, portfolioId: this.props.portfolio.id, utility: UtilityType.Electricity })}>
                    <UtilityIcon utility="nhh" iconClass="mr-1">NHH Electricity</UtilityIcon>
                </DropdownItem>);
        }
        if(!gas && this.checkHasMeters(2)){
            options.push(
                <DropdownItem key="gas" href="#" onClick={() => this.props.openCreateTenderDialog({ isHalfHourly: false, portfolioId: this.props.portfolio.id, utility: UtilityType.Gas })}>
                    <UtilityIcon utility="gas" iconClass="mr-1">Gas</UtilityIcon>
                </DropdownItem>);
        }

        return options;
    }

    render() {
        if(this.props.error){
            return (<ErrorMessage content={this.props.errorMessage} />);
        }
        if(this.props.working || !this.props.details || !this.props.consumption){
            return (<LoadingIndicator />);
        }
        if(this.props.details.portfolio.status != "tender"){
            return (
                <div className="w-100">
                    <Alert color="light">
                        <div className="d-flex align-items-center flex-column">
                            <i className="fas fa-info-circle mr-2"></i>
                            <p className="m-0 pt-1">This portfolio isn't ready to tender yet. Please upload data for applicable meters and ensure portfolio setup is complete.</p>
                        </div>
                    </Alert>
                </div>);
        }

        let content = (
            <Alert color="light">
                <div className="d-flex align-items-center flex-column">
                    <i className="fas fa-info-circle mr-2"></i>
                    <p className="m-0 pt-1">Click on the "Add Tender" button above to add your first tender.</p>
                </div>
            </Alert>);

        let hh = this.props.tenders.find(o => o.halfHourly && o.utility.toLowerCase() == "electricity");
        let nhh = this.props.tenders.find(o => !o.halfHourly && o.utility.toLowerCase() == "electricity");
        let gas = this.props.tenders.find(o => o.utility.toLowerCase() == "gas");
        
        let tenders = [hh, nhh, gas];
        let selectedTender = tenders[this.props.selectedTenderIndex] || tenders.find(t => t != null);
        
        let creationOptions = this.getCreationOptions(hh, nhh, gas);

        let hasTender = selectedTender != null;
        if(hasTender){
            content = this.renderSelectedTender(selectedTender);
        }
        
        return (
            <div className="w-100">
                <Row noGutters className="px-3 py-2">
                    <Col lg={4} xs={12} className="d-flex justify-content-center justify-content-lg-start align-items-center">
                        {!IsNullOrEmpty(creationOptions) && (
                            <UncontrolledDropdown className="pr-3 mt-2 mt-lg-0" setActiveFromChild>
                                <DropdownToggle color="accent" caret>
                                    <i className="fas fa-plus-circle mr-1"></i>
                                    <span className="mr-1">Add Tender</span>
                                </DropdownToggle>
                                <DropdownMenu>
                                    {creationOptions}
                                </DropdownMenu>
                            </UncontrolledDropdown>)}
                    </Col>
                    
                    <Col lg={4} xs={12} className="d-flex justify-content-center align-items-center">
                        {hasTender && (<UncontrolledDropdown>
                            <DropdownToggle color={selectedTender.utility.toLowerCase() === "electricity" ? "warning" : "orange"} caret className="d-flex align-items-center">
                                <span className="mr-1"><strong>Tender:</strong></span>
                                <span className="mr-1"><TenderUtilityIconTabHeader tender={selectedTender} /></span>
                            </DropdownToggle>
                            <DropdownMenu>
                                {hh && (
                                    <DropdownItem href="#" onClick={() => this.props.selectTender(0)}>
                                        <UtilityIcon utility="hh" iconClass="mr-1">HH: {hh.tenderTitle}</UtilityIcon>
                                    </DropdownItem>
                                )}
                                {nhh && (
                                    <DropdownItem href="#" onClick={() => this.props.selectTender(1)}>
                                        <UtilityIcon utility="nhh" iconClass="mr-1">NHH: {nhh.tenderTitle}</UtilityIcon>
                                    </DropdownItem>
                                )}
                                {gas && (
                                    <DropdownItem href="#" onClick={() => this.props.selectTender(2)}>
                                        <UtilityIcon utility="gas" iconClass="mr-1">Gas: {gas.tenderTitle}</UtilityIcon>
                                    </DropdownItem>
                                )}
                            </DropdownMenu>
                        </UncontrolledDropdown>)}
                    </Col>
                    
                    <Col lg={4} xs={12} className="invisible" />
                </Row>

                {content}

                <CreateTenderDialog />
                <UpdateTenderDialog />
            </div>);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, TendersProps> = (dispatch) => {
    return {
        getPortfolioTenders: (portfolioId: string) => dispatch(getPortfolioTenders(portfolioId)),
        getPortfolioOffers: (portfolioId: string) => dispatch(fetchTenderOffers(portfolioId)),
        getPortfolioRecommendations: (portfolioId: string) => dispatch(fetchTenderRecommendations(portfolioId)),

        selectTender: (index: number) => dispatch(selectTender(index)),
        selectTenderTab: (index: number) => dispatch(selectTenderTab(index)),
        
        fetchMeterConsumption: (portfolioId: string) => dispatch(fetchMeterConsumption(portfolioId)),

        openCreateTenderDialog: (data: CreateTenderDialogData) => dispatch(openDialog(ModalDialogNames.CreateTender, data))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, TendersProps, ApplicationState> = (state: ApplicationState) => {
    return {
        tenders: state.portfolio.tender.tenders.value,
        offers: state.portfolio.tender.offers.value,
        recommendations: state.portfolio.tender.recommendations.value,
        details: state.portfolio.details.value,
        consumption: state.meters.consumption.value,

        selectedTenderIndex: state.view.portfolio.selectedTenderIndex,
        selectedTenderTabIndex: state.view.portfolio.selectedTenderTabIndex,

        working: state.portfolio.tender.tenders.working || state.portfolio.details.working || state.meters.consumption.working || state.portfolio.tender.offers.working || state.portfolio.tender.recommendations.working,
        error: state.portfolio.tender.tenders.error || state.portfolio.details.error || state.meters.consumption.error || state.portfolio.tender.offers.error || state.portfolio.tender.recommendations.error,
        errorMessage: state.portfolio.tender.tenders.errorMessage || state.portfolio.details.errorMessage || state.meters.consumption.errorMessage || state.portfolio.tender.offers.errorMessage || state.portfolio.tender.recommendations.errorMessage,
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(Tenders);