import * as React from "react";
import ErrorMessage from "../../common/ErrorMessage";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { PortfolioDetails, UtilityType } from '../../../model/Models';
import * as moment from 'moment';

import { format } from 'currency-formatter';

import { Tender, TenderSupplier, TenderOfferType, isComplete, Tariff } from "../../../model/Tender";
import { openDialog } from "../../../actions/viewActions";
import { Button, Row, UncontrolledTooltip, Col, Card, CardBody, CardHeader } from "reactstrap";
import { fetchTariffs } from "../../../actions/portfolioActions";
import { UpdateTenderDialogData } from "./creation/UpdateTenderDialog";
import { ModalDialogNames } from "../../common/modal/ModalDialogNames";
import { LoadingIndicator } from "../../common/LoadingIndicator";
import ManageTenderSuppliersDialog, { ManageTenderSuppliersDialogData } from "./ManageTenderSuppliersDialog";

interface TenderStatusProps {
    tender: Tender;
    utility: UtilityType;
    details: PortfolioDetails;
}

interface StateProps {
    tariffs: Tariff[];
    suppliers: TenderSupplier[];
    working: boolean;
    error: boolean;
    errorMessage: string;
}

interface DispatchProps {
    fetchTariffs: () => void;

    openUpdateTenderDialog: (data: UpdateTenderDialogData) => void;
    openManageTenderSuppliersDialog: (data: ManageTenderSuppliersDialogData) => void;
}

class TenderStatus extends React.Component<TenderStatusProps & StateProps & DispatchProps, {}> {
    componentDidMount(){
        this.props.fetchTariffs();
    }

    getMeterCount(){
        var { meterGroups } = this.props.details;
        if (meterGroups == null || meterGroups.length == 0){
            return 0;
        }

        var utilityName = this.props.utility == UtilityType.Gas ? "GAS" : this.props.tender.halfHourly ? "HH" : "NHH";
        var foundGroup = meterGroups.find(mg => mg.groupName == utilityName);

        return foundGroup ? foundGroup.meterCount : 0;
    }

    getSupplierCount(){
        if(this.props.utility == UtilityType.Gas){
            return this.props.suppliers.filter(s => s.gasSupplier).length;
        }

        return this.props.suppliers.filter(s => s.electricitySupplier).length;
    }

    renderStringIfNotNull(value: string){
        if(value == null || value == ""){
            return "-";
        }
        return value;
    }

    renderAssignedSuppliers(){
        let { tender } = this.props;
        let assignedSupplierCount = tender.assignedSuppliers.length;

        let unshownSupplierCount = 0;
        if(assignedSupplierCount > 5) {
            unshownSupplierCount = assignedSupplierCount - 5;
        }
        
        let supplierImages: JSX.Element[] = [];
        for (let index = 0; index < assignedSupplierCount; index++) {
            if(index == 4){
                break;
            }
            const supplier = tender.assignedSuppliers[index];
            supplierImages.push(
                <div key={supplier.supplierId} className="px-2 d-flex align-items-center">
                    <img src={supplier.logoUri} style={{maxWidth: '88px', maxHeight: '50px'}} />
                </div>)
        }
        
        if(unshownSupplierCount > 0){
            supplierImages.push(
                <p key="extra-suppliers" className="m-0 pr-2">+ {unshownSupplierCount} more</p>
            )
        }

        return (
            <div className="d-flex flex-wrap justify-content-center align-items-center p-2">
                {supplierImages}
            </div>
        )
    }

    renderConsumptionValue(value: number){
        if(value > 1000000){
            var gigaValue = value / 1000000;
            return `${gigaValue.toFixed(3).toLocaleString()} GWh`;
        }
        return `${value.toLocaleString()} kWh`;
    }

    getCommissionRateString(tender: Tender): string {
        let result = "";
        if(tender.commission > 0){
            result = `${tender.commission}p/${tender.acuom}`;

            if(tender.commissionPerMonth > 0) {
                result += ",";
            }
        }

        if(tender.commissionPerMonth > 0) {
            result += `${format(tender.commissionPerMonth, {locale: 'en-GB'})}/month`;
        }

        return result;
    }

    render() {
        if(this.props.error){
            return (<ErrorMessage content={this.props.errorMessage} />);
        }
        if(this.props.working || this.props.suppliers == null || this.props.details == null || this.props.tariffs == null){
            return (<LoadingIndicator />);
        }
        
        var { tender } = this.props;
        let tenderComplete = isComplete(tender);
        
        let tariff = this.props.tariffs.find(t => t.tariffId == tender.requirements.tariffId);
        var eligibleSupplierCount = this.getSupplierCount();
        var totalCommission = (tender.commission / 100) * tender.annualConsumption;
        totalCommission = totalCommission + (tender.commissionPerMonth * 12);

        let offerTypeCount = tender.offerTypes.length;
        var durationsString = tender.offerTypes
        .sort(
            (o1: TenderOfferType, o2: TenderOfferType) => {        
                if (o1.duration < o2.duration) return -1;
                if (o1.duration > o2.duration) return 1;
                return 0;
            })
        .map(o => {
            if(o.duration == 0){
                return "Flexi";
            }
            return String(o.duration)
        })
        .join(', ');

        let deadline = moment(this.props.tender.deadline);
        return (
        <div className="px-3 pt-3">
            {/* <div className="text-center">
                    <h6><i className="fas fa-info-circle mr-1" />Status: {tender.packStatusMessage}</h6>
            </div> */}
            
            <Row>
                <Col lg={8} md={12}  className="mb-3">
                    <Card className="card-small h-100">
                        <CardHeader className="border-bottom pl-3 pr-2 py-2">
                            <div className="d-flex align-items-center">
                                <div className="flex-grow-1">
                                    <h6 className="m-0"><i className="fas fa-list-alt mr-1"></i>Tender Details</h6>
                                </div>
                                <Button color="accent" outline className="ml-2 btn-grey-outline align-self-center" id="edit-tender-button" 
                                    disabled={tenderComplete}
                                    onClick={() => this.props.openUpdateTenderDialog({ selectedTabIndex: 0, tender: this.props.tender, utility: this.props.utility })}>
                                    <i className="material-icons">
                                        mode_edit
                                    </i>
                                </Button>
                                <UncontrolledTooltip target="edit-tender-button" placement="bottom">
                                    <strong>Edit Tender Details</strong>
                                </UncontrolledTooltip>
                            </div>
                        </CardHeader>
                        <CardBody className="p-0 d-flex flex-column">
                            <Row className="px-2 pt-3 d-flex" noGutters>
                                <Col xs={6} className="d-flex flex-column justify-content-center text-center px-1 mt-md-0 mt-3">
                                    <h5 className="m-0 flex-grow-1 d-flex justify-content-center align-items-center">{this.renderConsumptionValue(tender.annualConsumption)}</h5>
                                    <div className="text-light pt-1"><i className="fas fa-plug text-accent mr-1"></i>Consumption</div>
                                </Col>
                                <Col xs={6} className="d-flex flex-column justify-content-center text-center border-left px-1 mt-md-0 mt-3">
                                    <h4 className="m-0 flex-grow-1 d-flex justify-content-center align-items-center"><strong>{format(totalCommission, { locale: 'en-GB'})}</strong></h4>
                                    <div className="text-light pt-1"><i className="fas fa-pound-sign mr-1 text-success"></i>Commission</div>
                                </Col>
                            </Row>
                            <Row noGutters className="d-block">
                            <hr />
                            </Row>
                            <Row className="p-2 pb-3" noGutters>
                                <Col xs={6} className="d-flex flex-column justify-content-center text-center px-1 mt-md-0 mt-3">
                                    <h5 className="m-0 flex-grow-1 d-flex justify-content-center">{tender.billingMethod}, {tender.paymentMethod}</h5>
                                    <div className="text-light pt-1"><i className="fas fa-receipt mr-1 text-indigo"></i>Billing &amp; Payment Methods</div>
                                </Col>
                                <Col xs={6} className="d-flex flex-column justify-content-center text-center border-left px-1 mt-md-0 mt-3">
                                    <h5 className="m-0 flex-grow-1 d-flex justify-content-center align-items-center">
                                        {this.getCommissionRateString(tender)}
                                    </h5>
                                    <div className="text-light pt-1"><i className="material-icons mr-1 text-teal">show_chart</i>Commission Rate</div>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
                <Col lg={4} md={12} className="mb-3">
                    <Card className="card-small h-100">
                        <CardHeader className="border-bottom pl-3 pr-2 py-2">
                            <div className="d-flex align-items-center">
                                <div className="flex-grow-1">
                                    <h6 className="m-0"><i className="fas fa-industry mr-1"></i>Assigned Suppliers</h6>
                                </div>
                                <Button color="accent" outline className="btn-grey-outline" size="sm" disabled={tenderComplete}
                                        onClick={() => this.props.openManageTenderSuppliersDialog({ assignedSuppliers: this.props.tender.assignedSuppliers, tenderId: this.props.tender.tenderId, utility: this.props.utility })}>
                                     <i className="material-icons mr-1">mode_edit</i>
                                    Manage
                                </Button>
                            </div>
                        </CardHeader>
                        <CardBody className="p-0 d-flex flex-column justify-content-center">
                            <Row className="p-2" noGutters>
                                <Col xs={6} className="text-center">
                                    <h4 className="m-0">{tender.assignedSuppliers.length}</h4>
                                    <div className="text-light"><i className="fas fa-check mr-1 text-success"></i>Assigned</div>
                                </Col>
                                <Col xs={6} className="text-center border-left">
                                    <h4 className="m-0">{eligibleSupplierCount - tender.assignedSuppliers.length}</h4>
                                    <div className="text-light">Available</div>
                                </Col>
                            </Row>
                            {this.renderAssignedSuppliers()}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col lg={9} sm={12} className="mb-3">
                    <Card className="card-small h-100">
                        <CardHeader className="border-bottom pl-3 pr-2 py-2">
                            <div className="d-flex align-items-center">
                                <div className="flex-grow-1">
                                    <h6 className="m-0"><i className="fas fa-clipboard-list mr-1"></i>Requirements</h6>
                                </div>
                                <Button color="accent" outline className="ml-2 btn-grey-outline align-self-center" id="edit-tender-requirements-button"
                                    disabled={tenderComplete}
                                    onClick={() => this.props.openUpdateTenderDialog({ selectedTabIndex: 1, tender: this.props.tender, utility: this.props.utility })}>
                                    <i className="material-icons">
                                        mode_edit
                                    </i>
                                </Button>
                                <UncontrolledTooltip target="edit-tender-requirements-button" placement="bottom">
                                    <strong>Edit Tender Requirements</strong>
                                </UncontrolledTooltip>
                            </div>
                        </CardHeader>
                        <CardBody className="p-0 d-flex flex-column">
                            <Row className="p-2 pb-3 d-flex align-items-center flex-grow-1" noGutters>
                                <Col lg xs={4} className="text-center px-1 mt-md-0 mt-sm-3">
                                    <h4 className="m-0">{tender.requirements.paymentTerms != 0 ? `${tender.requirements.paymentTerms} days` : "-"}</h4>
                                    <div className="text-light pt-1"><i className="fas fa-file-invoice-dollar text-accent mr-1"></i>Payment Terms</div>
                                </Col>
                                <Col lg xs={4} className="text-center border-left px-1 mt-md-0 mt-sm-3">
                                        {
                                            offerTypeCount <= 3 ? (<h5 className="m-0">{`${durationsString} months`}</h5>) : (
                                                <div>
                                                    <h5>{`${offerTypeCount} selected`}<i className="fas fa-info-circle text-accent ml-1" id="tender-requirements-offer-types-icon"/></h5>
                                                    <UncontrolledTooltip target="tender-requirements-offer-types-icon" placement="top">{`${durationsString} months`}</UncontrolledTooltip>
                                                </div>
                                            )
                                        }
                                    <div className="text-light pt-1"><i className="material-icons mr-1 text-indigo">update</i>Offer Duration{tender.offerTypes.length > 1 ? "s" : null}</div>
                                </Col>
                                <Col lg xs={4} className="text-center border-left px-1 mt-md-0 mt-sm-3">
                                    <h4 className="m-0">{`${tender.requirements.greenPercentage}%`}</h4>
                                    <div className="text-light pt-1"><i className="fas fa-leaf mr-1 text-success"></i>Green</div>
                                </Col>
                                {this.props.utility == UtilityType.Electricity && (
                                    <Col lg xs={6} className="text-center border-left px-1 mt-md-0 mt-sm-3">
                                        <h4 className="m-0">{tender.allInclusive ? `Inclusive` : `Pass-Through`}</h4>
                                        <div className="text-light pt-1"><i className="fas fa-thumbs-up mr-1 text-primary"></i>Embedded Benefits</div>
                                    </Col>
                                )}
                                {(this.props.utility == UtilityType.Electricity && tender.halfHourly) &&  (
                                    <Col lg xs={6} className="text-center border-left px-1 mt-md-0 mt-sm-3">
                                        <h4 className="m-0">{tariff ? tariff.name : `None`}</h4>
                                        <div className="text-light pt-1"><i className="fas fa-sun mr-1 text-warning"></i>Tariff</div>
                                    </Col>
                                )}
                            </Row>
                        </CardBody>
                        {/* <CardFooter className="border-top">
                            <div className="text-center">
                                <span className="text-small"><i className="fas fa-info mr-1" />You can change these figures by editing the tender.</span>
                            </div>
                        </CardFooter> */}
                    </Card>
                </Col>
                <Col lg={3} sm={12} className="mb-3">
                    <Card className="card-small h-100">
                        <CardHeader className="border-bottom px-3 py-2">
                            <h6 className="m-0"><i className="fas fa-clock mr-1"></i>Deadline</h6>
                        </CardHeader>
                        <CardBody className="p-0 d-flex flex-column">
                            <Row className="p-2 d-flex align-items-center flex-grow-1" noGutters>
                                <Col className="text-center px-1">
                                    {!tender.deadlineNotes || tender.deadlineNotes.IsWhitespace() ? 
                                        (<h4 className="m-0">{this.props.tender.deadline ? deadline.local().format("DD/MM/YYYY") : "-"}</h4>) : 
                                        (
                                            <div>
                                                <h4 className="m-0">{this.props.tender.deadline ? deadline.local().format("DD/MM/YYYY") : "-"} <i className="fas fa-info-circle text-accent ml-1" id="tender-requirements-deadline-notes-icon"/></h4>
                                                <UncontrolledTooltip target="tender-requirements-deadline-notes-icon" placement="top">{tender.deadlineNotes}</UncontrolledTooltip>
                                            </div>
                                        )}
                                    <div className="text-light pt-1"><i className="fas fa-stopwatch mr-1"></i>Deadline</div>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <ManageTenderSuppliersDialog />
        </div>
        )
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, TenderStatusProps> = (dispatch) => {
    return {
        fetchTariffs: () => dispatch(fetchTariffs()),

        openUpdateTenderDialog: (data: UpdateTenderDialogData) => dispatch(openDialog(ModalDialogNames.UpdateTender, data)),
        openManageTenderSuppliersDialog: (data: ManageTenderSuppliersDialogData) => dispatch(openDialog(ModalDialogNames.ManageTenderSuppliers, data))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, TenderStatusProps, ApplicationState> = (state: ApplicationState) => {
    return {
        tariffs: state.portfolio.tender.tariffs.value,
        suppliers: state.suppliers.value,
        working: state.suppliers.working || state.portfolio.tender.tariffs.working,
        error: state.suppliers.error || state.portfolio.tender.tariffs.error,
        errorMessage: state.suppliers.errorMessage || state.portfolio.tender.tariffs.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(TenderStatus);