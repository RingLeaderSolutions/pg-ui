import * as React from "react";
import { UtilityType, decodeUtilityType } from '../../../../model/Models';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../../applicationState';
import * as moment from 'moment';
import * as cn from "classnames";

import { fetchTariffs } from '../../../../actions/portfolioActions';
import { createTender } from '../../../../actions/tenderActions';
import { Tender, TenderRequirements, Tariff, TenderOfferType } from "../../../../model/Tender";
import { TenthYearFuture, DayPickerWithMonthYear, Today } from "../../../common/DayPickerHelpers";
import asModalDialog, { ModalDialogProps } from "../../../common/modal/AsModalDialog";
import { ModalDialogNames } from "../../../common/modal/ModalDialogNames";
import { LoadingIndicator } from "../../../common/LoadingIndicator";
import { Strings } from "../../../../helpers/Utils";
import { ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Button, Navbar, Nav, NavItem, NavLink, Col, Row, InputGroup, InputGroupAddon, CustomInput } from "reactstrap";

export interface CreateTenderDialogData {
    portfolioId: string;
    utility: UtilityType;
    isHalfHourly: boolean;
}

interface CreateTenderDialogProps extends ModalDialogProps<CreateTenderDialogData> { }

interface StateProps {
    working: boolean;
    error: boolean;
    errorMessage: string;
    tariffs: Tariff[];    
}
  
interface DispatchProps {
    createTender: (portfolioId: string, tender: Tender, utility: UtilityType, isHalfHourly: boolean) => void;
    fetchTariffs: () => void;    
}

interface CreateTenderState {
    deadline: moment.Moment;   
    title: string;
    commission: string;
    billingMethod: string;
    deadlineNotes: string;
    ebInclusive: boolean;
    paymentTerms: string;
    tariff: string;
    greenPercentage: string;
    durations: number[];
    paymentMethod: string;
    commissionPerMonth: string;

    selectedTabIndex: number;
}

class CreateTenderDialog extends React.Component<CreateTenderDialogProps & StateProps & DispatchProps, CreateTenderState> {
    constructor(props: CreateTenderDialogProps & StateProps & DispatchProps){
        super(props);
        this.state = {
            deadline: null,
            title: '',
            commission:'',
            billingMethod: '',
            deadlineNotes: '',
            ebInclusive: true,
            paymentTerms: "0",
            tariff: '',
            greenPercentage: '',
            durations: [ 12 ],
            paymentMethod: '',
            commissionPerMonth: '',
            selectedTabIndex: 0
        };

        this.stateHasDuration = this.stateHasDuration.bind(this);
    }

    handleFormChange(attribute: string, event: React.ChangeEvent<any>){
        var value = event.target.value;

        this.setState({
            ...this.state,
            [attribute]: value
        })
    }

    componentDidMount(){
        this.props.fetchTariffs();
    }

    handleDeadlineChange(date: moment.Moment){
        this.setState({
            ...this.state,
            deadline: date
        });
    }

    handleInclusiveChange(flip: boolean, e: React.ChangeEvent<HTMLInputElement>){
        var value = flip ? !e.target.checked : e.target.checked;
        this.setState({
            ...this.state,
            ebInclusive: value
        });
    }

    handleOfferTypeChange(duration: number, e: React.ChangeEvent<HTMLInputElement>){
        var value = e.target.checked;
        var durations = this.state.durations.slice();
        
        var existingPos = durations.indexOf(duration);
        if(value && existingPos == -1){
            durations.push(duration);
        }
        else if (existingPos != -1) {
            durations.splice(existingPos, 1);
        }
        
        this.setState({
            ...this.state,
            durations
        });
    }

    stateHasDuration(duration: number): boolean{
        return this.state.durations.findIndex(d => d == duration) != -1;
    }

    renderTariffOptions(){
        return this.props.tariffs.map(t => {
            return (<option key={t.id} value={t.id}>{t.name}</option>)
        });
    }

    renderDurationOptions(...durations: number[]){
        return durations.map(d => {
            return (
                <Col xs={4} key={`new-tender-duration-col-${d}`}>
                    <CustomInput type="checkbox" className="my-1"
                            id={`new-tender-duration-check-${d}`}
                            checked={this.stateHasDuration(d)}
                            onChange={(e) => this.handleOfferTypeChange(d, e)}
                            label={`${d} months`}
                            inline/>
                </Col>);
        })
    }

    createTender(){
        let { portfolioId, utility, isHalfHourly } = this.props.data;
        let requirements: TenderRequirements = {
            id: "",
            portfolioId,
            tenderId: "",

            paymentTerms: Number(this.state.paymentTerms),
            greenPercentage: Number(this.state.greenPercentage),

            tariffId: this.state.tariff ? this.state.tariff : null
        };

        var offerTypes : TenderOfferType[] = this.state.durations.map(d => {
            return {
                id: null,
                tenderId: null,

                product: this.state.ebInclusive ? "inclusive" : "pass-thru",
                duration: d
            }
        });

        var tender: Tender = {
            portfolioId,
            utility: utility == UtilityType.Electricity ? "ELECTRICITY" : "GAS",

            tenderTitle: this.state.title,
            billingMethod: this.state.billingMethod,
            deadline: this.state.deadline ? this.state.deadline.format("YYYY-MM-DDTHH:mm:ss") : null,
            deadlineNotes: this.state.deadlineNotes,
            commission: Number(this.state.commission),
            commissionPerMonth: Number(this.state.commissionPerMonth),
            paymentMethod: this.state.paymentMethod,
            halfHourly: isHalfHourly,
            allInclusive: this.state.ebInclusive,
            offerTypes,
            requirements
        }

        this.props.createTender(portfolioId, tender, utility, isHalfHourly);
        this.props.toggle();
    }

    selectTab(tabIndex: number){
        this.setState({
            ...this.state,
            selectedTabIndex: tabIndex
        });
    }

    renderRequirementsEditForm(){
        var isGasTender = this.props.data.utility == UtilityType.Gas;
        var isHalfhourly = this.props.data.isHalfHourly;
        return (
            <Form>
                <Row>
                    <Col xs={6} className={cn({'pr-1' : !isGasTender && isHalfhourly })}>
                        <FormGroup>
                            <Label for="new-tender-payment-terms">Payment Terms</Label>
                            <CustomInput type="select" name="payment-terms-picker" id="new-tender-payment-terms"
                                   value={this.state.paymentTerms}
                                   onChange={(e) => this.handleFormChange("paymentTerms", e)}>
                                <option value="0" disabled>Select</option>
                                <option value={7}>7 days</option>
                                <option value={14}>14 days</option>
                                <option value={21}>21 days</option>
                                <option value={28}>28 days</option>
                            </CustomInput>
                        </FormGroup>
                    </Col>
                    { (!isGasTender && isHalfhourly) && (
                        <Col xs={6} className="pl-1">
                            <FormGroup>
                                <Label for="new-tender-tariff">Tariff</Label>
                                <CustomInput type="select" name="tariff-picker" id="new-tender-tariff"
                                       value={this.state.tariff}
                                       onChange={(e) => this.handleFormChange("tariff", e)}>
                                    <option value="" disabled>Select</option>                                            
                                    {this.renderTariffOptions()}
                                </CustomInput>
                            </FormGroup>
                        </Col>)}          
                    <Col xs={6} className={cn({'pr-1' : isGasTender || !isHalfhourly })}>
                        <FormGroup>
                            <Label for="new-tender-green-perc">Green Percentage</Label>
                            <InputGroup name="green-percentage-amount" id="new-tender-green-perc">
                                <Input type="number" 
                                    step="1"
                                    min="0"
                                    max="100"
                                    placeholder="e.g. 50"
                                    value={this.state.greenPercentage}
                                   onChange={(e) => this.handleFormChange("greenPercentage", e)}/>
                                <InputGroupAddon addonType="append">%</InputGroupAddon>
                            </InputGroup>
                        </FormGroup>
                    </Col>          
                </Row>
                <hr />
                {!isGasTender && (
                    <div>
                        <Label>Embedded Benefits</Label>
                        <Row noGutters>
                            <FormGroup className="mb-0">
                                <CustomInput type="radio" className="ml-3"
                                        id="new-tender-eb-inclusive"
                                        checked={this.state.ebInclusive} 
                                        onChange={(e) => this.handleInclusiveChange(false, e)}
                                        label="Inclusive"
                                        inline/>
                                <CustomInput type="radio" className="ml-3"
                                        id="new-tender-eb-passthru"
                                        checked={!this.state.ebInclusive}
                                        onChange={(e) => this.handleInclusiveChange(true, e)}
                                        label="Pass Through"
                                        inline/>
                            </FormGroup>
                        </Row>
                        <hr />
                    </div>
                )}

                <FormGroup>
                    <Label for="new-tender-durations">Requested Offer Durations</Label>
                    <Row>
                        <Col xs={4}>
                            <CustomInput type="checkbox" className="my-1"
                                    id="new-tender-duration-check-0"
                                    checked={this.stateHasDuration(0)}
                                    onChange={(e) => this.handleOfferTypeChange(0, e)}
                                    label="0 (Flexi)"
                                    inline/>
                        </Col>
                        {this.renderDurationOptions(6, 12, 18, 24, 36, 48, 60)}
                    </Row>
                </FormGroup>
            </Form>);
    }

    renderGeneralEditForm(){ 
        return (
            <Form>
                <FormGroup>
                    <Label for="new-tender-title">Title</Label>
                    <Input id="new-tender-title"
                            value={this.state.title}
                            onChange={(e) => this.handleFormChange("title", e)} />
                </FormGroup>

                <Row noGutters>
                    <Col xs={6}>
                        <FormGroup>
                            <Label>Deadline</Label>
                            <DayPickerWithMonthYear 
                                disablePast={true} 
                                fromMonth={Today} 
                                toMonth={TenthYearFuture} 
                                onDayChange={(d: moment.Moment) => this.handleDeadlineChange(d)}
                                selectedDay={this.state.deadline} />
                        </FormGroup>       
                    </Col>
                </Row>

                <FormGroup>
                    <Label for="new-tender-deadline-notes">Deadline Notes</Label>
                    <Input id="new-tender-deadline-notes"
                           type="textarea"
                           value={this.state.deadlineNotes}
                           onChange={(e) => this.handleFormChange("deadlineNotes", e)} />
                </FormGroup>

                <Label>Commission</Label>
                <Row noGutters>    
                    <Col className="pr-1">
                        <FormGroup>
                            <InputGroup>
                                <Input type="number"
                                    step="0.1"
                                    placeholder="e.g. 0.1"
                                    value={this.state.commission}
                                    onChange={(e) => this.handleFormChange("commission", e)} />
                                <InputGroupAddon addonType="append">p/kWh</InputGroupAddon>
                            </InputGroup>
                        </FormGroup>
                    </Col>
                    <Col className="pl-1">
                        <FormGroup>
                            <InputGroup>
                                <InputGroupAddon addonType="prepend">£</InputGroupAddon>
                                <Input type="number"
                                    step="0.01"
                                    placeholder="e.g. 11.89"
                                    value={this.state.commissionPerMonth}
                                    onChange={(e) => this.handleFormChange("commissionPerMonth", e)} />
                                <InputGroupAddon addonType="append">/month</InputGroupAddon>
                            </InputGroup>
                        </FormGroup>
                    </Col>
                </Row>

                <Row noGutters>
                    <Col className="pr-1">
                        <FormGroup>
                            <Label for="new-tender-billing-method">Billing Method</Label>
                            <CustomInput type="select" 
                                         name="billing-method-picker" 
                                         id="new-tender-billing-method"
                                         value={this.state.billingMethod}
                                         onChange={(e) => this.handleFormChange("billingMethod", e)}>
                                <option value="" disabled>Select</option>
                                <option>Paper</option>
                                <option>Electronic</option>
                            </CustomInput>
                        </FormGroup>
                    </Col>
                    <Col className="pl-1">
                        <FormGroup>
                            <Label for="new-tender-payment-method">Payment Method</Label>
                            <CustomInput type="select"
                                            name="payment-method-picker"
                                            id="new-tender-payment-method"
                                            value={this.state.paymentMethod}
                                            onChange={(e) => this.handleFormChange("paymentMethod", e)}>
                                <option value="" disabled>Select</option>
                                <option>BACS</option>
                                <option>Direct Debit</option>
                                <option>Cheque</option>
                            </CustomInput>
                        </FormGroup>
                    </Col>
                </Row>     
            </Form>
        );
    }

    canSubmit(){
        return Strings.AreNotNullOrEmpty(this.state.title) && this.state.deadline;
    }

    render() {
        if(this.props.working || this.props.tariffs == null){
            return (<LoadingIndicator />);
        }
        return (
            <div className="modal-content">
                <ModalHeader toggle={this.props.toggle}><i className="fas fa-shopping-cart mr-2"></i>Add {decodeUtilityType(this.props.data.utility)} Tender</ModalHeader>
                <Navbar className="p-0 bg-white">
                    <Nav tabs className="justify-content-center flex-grow-1">
                        <NavItem>
                            <NavLink className={cn({ active: this.state.selectedTabIndex === 0})}
                                    onClick={() => this.selectTab(0)}
                                    href="#">
                                <i className="fa fa-list-alt"></i>Details
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className={cn({ active: this.state.selectedTabIndex === 1}, "ml-2")}
                                        onClick={() => this.selectTab(1)}
                                        href="#">
                                <i className="fas fa-clipboard-list"></i>Requirements
                            </NavLink>
                        </NavItem>
                    </Nav>
                </Navbar>
                <ModalBody>
                    {this.state.selectedTabIndex === 0 && this.renderGeneralEditForm()}
                    {this.state.selectedTabIndex === 1 && this.renderRequirementsEditForm()}
                </ModalBody>
                <ModalFooter>
                    <Button onClick={this.props.toggle}>
                        <i className="fas fa-times mr-1"></i>Cancel
                    </Button>
                    <Button color="accent" 
                            disabled={!this.canSubmit()}
                            onClick={() => this.createTender()}>
                        <i className="fas fa-plus-circle mr-1"></i>Add
                    </Button>
                </ModalFooter>
            </div>);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, CreateTenderDialogProps> = (dispatch) => {
    return {
        createTender: (portfolioId, tender, utilityType, isHalfHourly) => dispatch(createTender(portfolioId, tender, utilityType, isHalfHourly)),
        fetchTariffs: () => dispatch(fetchTariffs())
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, CreateTenderDialogProps, ApplicationState> = (state: ApplicationState) => {
    return {
        tariffs: state.portfolio.tender.tariffs.value,

        working: state.portfolio.tender.tariffs.working,
        error: state.portfolio.tender.tariffs.error,
        errorMessage: state.portfolio.tender.tariffs.errorMessage
    };
};
  
export default asModalDialog<CreateTenderDialogProps, StateProps, DispatchProps>(
{ 
    name: ModalDialogNames.CreateTender, 
    centered: true, 
    backdrop: true,
}, mapStateToProps, mapDispatchToProps)(CreateTenderDialog)