import * as React from "react";
import { UtilityType, decodeUtilityType } from '../../../../model/Models';
import { MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../../applicationState';
import * as moment from 'moment';
import * as cn from "classnames";

import { updateTender, deleteTender } from '../../../../actions/tenderActions';
import { Tender, TenderRequirements, Tariff, TenderOfferType } from "../../../../model/Tender";
import { DayPickerWithMonthYear, Today, TenthYearFuture } from "../../../common/DayPickerHelpers";
import AsModalDialog, { ModalDialogProps } from "../../../common/modal/AsModalDialog";
import { Strings } from "../../../../helpers/Utils";
import { LoadingIndicator } from "../../../common/LoadingIndicator";
import { ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Button, Navbar, Nav, NavItem, NavLink, Col, Row, InputGroup, InputGroupAddon, CustomInput } from "reactstrap";
import { ModalDialogNames } from "../../../common/modal/ModalDialogNames";
import AlertConfirmDialog, { AlertConfirmDialogData } from "../../../common/modal/AlertConfirmDialog";
import { openAlertConfirmDialog } from "../../../../actions/viewActions";

export interface UpdateTenderDialogData {
    tender: Tender;
    utility: UtilityType;
    selectedTabIndex: number;
}

interface StateProps {
    working: boolean;
    error: boolean;
    errorMessage: string;
    tariffs: Tariff[];    
}
  
interface DispatchProps {
    updateTender: (tenderId: string, details: Tender) => void;
    deleteTender: (portfolioId: string, tenderId: string) => void;

    openAlertConfirmDialog: (data: AlertConfirmDialogData) => void;
}

interface UpdateTenderState {
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

class UpdateTenderDialog extends React.Component<ModalDialogProps<UpdateTenderDialogData> & StateProps & DispatchProps, UpdateTenderState> {
    constructor(props: ModalDialogProps<UpdateTenderDialogData> & StateProps & DispatchProps){
        super(props);
        let { tender, selectedTabIndex } = this.props.data;

        this.state = {
            deadline: tender.deadline ? moment(tender.deadline) : null,
            title: tender.tenderTitle || '',
            commission: String(tender.commission),
            billingMethod: tender.billingMethod,
            deadlineNotes: tender.deadlineNotes || '',
            ebInclusive: tender.allInclusive,
            paymentTerms: String(tender.requirements.paymentTerms),
            tariff: tender.requirements.tariffId || '',
            greenPercentage: String(tender.requirements.greenPercentage),
            durations: tender.offerTypes.map(ot => ot.duration),
            paymentMethod: tender.paymentMethod || '',
            commissionPerMonth: tender.commissionPerMonth ? String(tender.commissionPerMonth) : '',

            selectedTabIndex
        };
    }

    handleFormChange(attribute: string, event: React.ChangeEvent<any>){
        var value = event.target.value;

        this.setState({
            ...this.state,
            [attribute]: value
        })
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

    renderDurationOptions(...durations: number[]){
        return durations.map(d => {
            return (
                <Col xs={4} key={`update-tender-duration-col-${d}`}>
                    <CustomInput type="checkbox" className="my-1"
                            id={`update-tender-duration-check-${d}`}
                            checked={this.stateHasDuration(d)}
                            onChange={(e) => this.handleOfferTypeChange(d, e)}
                            label={`${d} months`}
                            inline/>
                </Col>);
        })
    }
    
    renderTariffOptions(){
        return this.props.tariffs.map(t => {
            return (<option key={t.tariffId} value={t.tariffId}>{t.name}</option>)
        });
    }

    updateTender(){
        var { tender } = this.props.data;

        let requirements: TenderRequirements = {
            id: "",
            portfolioId: tender.portfolioId,
            tenderId: tender.tenderId,

            paymentTerms: Number(this.state.paymentTerms),
            greenPercentage: Number(this.state.greenPercentage),
            
            tariffId: this.state.tariff ? this.state.tariff : null
        };

        var offerTypes : TenderOfferType[] = this.state.durations.map(d => {
            return {
                id: null,
                tenderId: tender.tenderId,

                product: this.state.ebInclusive ? "inclusive" : "pass-thru",
                duration: d
            }
        });

        var tender: Tender = {
            ...tender,
            tenderTitle: this.state.title,
            billingMethod: this.state.billingMethod,
            deadline: this.state.deadline ? this.state.deadline.format("YYYY-MM-DDTHH:mm:ss") : null,
            deadlineNotes: this.state.deadlineNotes,
            commission: Number(this.state.commission),
            halfHourly: tender.halfHourly,
            allInclusive: this.state.ebInclusive,
            paymentMethod: this.state.paymentMethod,
            commissionPerMonth: Number(this.state.commissionPerMonth),
            requirements,
            offerTypes
        }

        this.props.updateTender(tender.tenderId, tender);
        this.props.toggle();
    }

    openConfirmDeleteTender(){
        this.props.openAlertConfirmDialog({
            title: "Confirm",
            body: `Are you sure you want to delete this tender from the portfolio?`,
            confirmText: "Yes",
            confirmIcon: "trash-alt",
            headerClass: "modal-header-danger",
            confirmButtonColor: "danger",
            onConfirm: () => {
                this.props.deleteTender(this.props.data.tender.portfolioId, this.props.data.tender.tenderId);
                this.props.toggle();
            }
        });
    }

    selectTab(tabIndex: number){
        this.setState({
            ...this.state,
            selectedTabIndex: tabIndex
        });
    }

    renderRequirementsEditForm(){
        var isGasTender = this.props.data.utility == UtilityType.Gas;
        var isHalfhourly = this.props.data.tender.halfHourly;

        return (
            <Form>
                <Row>
                    <Col xs={6} className={cn({'pr-1' : !isGasTender && isHalfhourly })}>
                        <FormGroup>
                            <Label for="update-tender-payment-terms">Payment Terms</Label>
                            <CustomInput type="select" name="payment-terms-picker" id="update-tender-payment-terms"
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
                                <Label for="update-tender-tariff">Tariff</Label>
                                <CustomInput type="select" name="tariff-picker" id="update-tender-tariff"
                                       value={this.state.tariff}
                                       onChange={(e) => this.handleFormChange("tariff", e)}>
                                    <option value="" disabled>Select</option>                                            
                                    {this.renderTariffOptions()}
                                </CustomInput>
                            </FormGroup>
                        </Col>)}          
                    <Col xs={6} className={cn({'pr-1' : isGasTender || !isHalfhourly })}>
                        <FormGroup>
                            <Label for="update-tender-green-perc">Green Percentage</Label>
                            <InputGroup name="green-percentage-amount" id="update-tender-green-perc">
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
                                        id="update-tender-eb-inclusive"
                                        checked={this.state.ebInclusive} 
                                        onChange={(e) => this.handleInclusiveChange(false, e)}
                                        label="Inclusive"
                                        inline/>
                                <CustomInput type="radio" className="ml-3"
                                        id="update-tender-eb-passthru"
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
                    <Label for="update-tender-durations">Requested Offer Durations</Label>
                    <Row>
                        <Col xs={4}>
                            <CustomInput type="checkbox" className="my-1"
                                    id="update-tender-duration-check-0"
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
                    <Label for="update-tender-title">Title</Label>
                    <Input id="update-tender-title"
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
                    <Label for="update-tender-deadline-notes">Deadline Notes</Label>
                    <Input id="update-tender-deadline-notes"
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
                            <Label for="update-tender-billing-method">Billing Method</Label>
                            <CustomInput type="select" 
                                         name="billing-method-picker" 
                                         id="update-tender-billing-method"
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
                            <Label for="update-tender-payment-method">Payment Method</Label>
                            <CustomInput type="select"
                                            name="payment-method-picker"
                                            id="update-tender-payment-method"
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
                <ModalHeader toggle={this.props.toggle}><i className="material-icons mr-2">mode_edit</i>Edit {decodeUtilityType(this.props.data.utility)} Tender</ModalHeader>
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
                <ModalFooter className="justify-content-between">
                    <Button color="danger"
                            onClick={() => this.openConfirmDeleteTender()}>
                            <i className="fas fa-trash-alt mr-1" />Delete
                    </Button>
                    <Button onClick={this.props.toggle}>
                        <i className="fas fa-times mr-1"></i>Cancel
                    </Button>
                    <Button color="accent" 
                            disabled={!this.canSubmit()}
                            onClick={() => this.updateTender()}>
                        <i className="material-icons mr-1">mode_edit</i>Save
                    </Button>
                </ModalFooter>
                <AlertConfirmDialog />
            </div>);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => {
    return {
        updateTender: (portfolioId, tender) => dispatch(updateTender(portfolioId, tender)),
        deleteTender: (portfolioId: string, tenderId: string) => dispatch(deleteTender(portfolioId, tenderId)),

        openAlertConfirmDialog: (data: AlertConfirmDialogData) => dispatch(openAlertConfirmDialog(data))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, {}, ApplicationState> = (state: ApplicationState) => {
    return {
        working: state.portfolio.tender.update_tender.working || state.portfolio.tender.tariffs.working,
        error: state.portfolio.tender.update_tender.error  ||  state.portfolio.tender.tariffs.error,
        errorMessage: state.portfolio.tender.update_tender.errorMessage  || state.portfolio.tender.tariffs.errorMessage,
        tariffs: state.portfolio.tender.tariffs.value        
    };
};
  
export default AsModalDialog<UpdateTenderDialogData, StateProps, DispatchProps>(
{ 
    name: ModalDialogNames.UpdateTender, 
    centered: true, 
    backdrop: true,
}, mapStateToProps, mapDispatchToProps)(UpdateTenderDialog)