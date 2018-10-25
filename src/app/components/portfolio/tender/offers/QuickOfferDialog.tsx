import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../../applicationState';
import { TenderSupplier, Tender, QuickQuoteEntry, QuickQuote } from "../../../../model/Tender";

import { uploadElectricityOffer, uploadGasOffer, submitQuickQuote } from '../../../../actions/tenderActions';
import { UploadPanel } from "../../../common/UploadPanel";
import { getWellFormattedUtilityName } from "../../../common/UtilityIcon";
import asModalDialog, { ModalDialogProps } from "../../../common/modal/AsModalDialog";
import { ModalDialogNames } from "../../../common/modal/ModalDialogNames";
import { ModalFooter, ModalHeader, ModalBody, Form, FormGroup, Label, CustomInput, Button, Table, Input, ButtonGroup, Row, Col, UncontrolledTooltip } from "reactstrap";
import { fetchMeterConsumption } from "../../../../actions/meterActions";
import { LoadingIndicator } from "../../../common/LoadingIndicator";
import { MeterConsumptionSummary } from "../../../../model/Meter";
import * as cn from "classnames";
import InputGroup from "reactstrap/lib/InputGroup";
import InputGroupAddon from "reactstrap/lib/InputGroupAddon";

export interface QuickOfferDialogData {
    supplierId?: string;
    tender: Tender;
    consumption: MeterConsumptionSummary;
}

interface QuickOfferDialogProps extends ModalDialogProps<QuickOfferDialogData> { }

interface StateProps {
    working: boolean;
    error: boolean;
    errorMessage: string;
}

interface DispatchProps {
    submitQuickQuote: (tenderId: string, quote: QuickQuote) => void;
}

interface UploadOfferState {
    selectedSupplierId: string;
    unitsOfMeasurement: string;
    duration: string;
    quoteEntries: QuoteEntryItem[];
}

interface QuoteEntryItem {
    meterNumber: string;
    rate: string;
    standingCharge: string;
    [index: string]: any;
}

class QuickOfferDialog extends React.Component<QuickOfferDialogProps & StateProps & DispatchProps, UploadOfferState> {
    constructor(props: QuickOfferDialogProps & StateProps & DispatchProps){
        super(props);

        let { tender, consumption } = props.data;
        let lowerUtility = tender.utility.toLowerCase();
        let quoteEntries: QuoteEntryItem[] = [];
        
        if(lowerUtility === "electricity"){
            quoteEntries = consumption.electrictyConsumptionEntries
                .filter(ec => ec[2] === "NHH")
                .map(ec => this.createQuoteEntryFromConsumption(ec));
        }
        else {
            quoteEntries = consumption.gasConsumptionEntries
                .map(ec => this.createQuoteEntryFromConsumption(ec));
        }

        this.state = {
            quoteEntries: quoteEntries,
            duration: "0",
            selectedSupplierId: "",
            unitsOfMeasurement: "POUNDS_PER_MONTH"
        };
    }

    createQuoteEntryFromConsumption(consumption: string[]): QuoteEntryItem {
        return {
            meterNumber: consumption[1],
            rate: "",
            standingCharge: "",
        };
    }

    submit() {
        let { tender } = this.props.data;

        let quote: QuickQuote = {
            supplierId: this.state.selectedSupplierId,
            prices: this.state.quoteEntries.map(qe => {
                let entry: QuickQuoteEntry = 
                    {
                        standingChargeUOM: this.state.unitsOfMeasurement, 
                        duration: Number(this.state.duration), 
                        rate: Number(qe.rate), 
                        standingCharge: Number(qe.standingCharge), 
                        meterNumber: qe.meterNumber 
                    };
                return entry;
            })
        };

        this.props.submitQuickQuote(tender.tenderId, quote);
        this.props.toggle();
    }

    canSubmit(){
        return !this.state.selectedSupplierId.IsNullOrEmpty()
            && this.state.quoteEntries.every(qe => Number(qe.rate) > 0 && Number(qe.standingCharge) > 0);
    }
    
    handleEntryChange(meterNumber: string, attribute: string, value: any) {
        let entryIndex = this.state.quoteEntries.findIndex(qe => qe.meterNumber === meterNumber);
        
        const entryCopy = {...this.state.quoteEntries[entryIndex]};
        entryCopy[attribute] = value;

        this.setState({
            ...this.state,
            quoteEntries: [
                ...this.state.quoteEntries.slice(0, entryIndex),
                entryCopy,
                ...this.state.quoteEntries.slice(entryIndex + 1),
            ]
        })
    }

    copyDown(meterNumber: string, attribute: string){
        let entryIndex = this.state.quoteEntries.findIndex(qe => qe.meterNumber === meterNumber);
        let entry = this.state.quoteEntries[entryIndex];

        let entryValue = entry[attribute];
        let entriesToUpdate = this.state.quoteEntries.slice(entryIndex + 1);
        let updatedEntries = entriesToUpdate.map(qe => {
            let copy: QuoteEntryItem = { ... qe };
            copy[attribute] = entryValue;
            return copy;
        });

        this.setState({
            ...this.state,
            quoteEntries: [
                ...this.state.quoteEntries.slice(0, entryIndex + 1),
                ...updatedEntries
            ]
        });
    }

    handleFormChange(attribute: string, event: React.ChangeEvent<any>) {
        this.setState({
            ...this.state,
            [attribute]: event.target.value
        })
    }

    handleUnitChange(unit: "POUNDS_PER_MONTH" | "PENCE_PER_KWH" | "PENCE_PER_DAY") {
        this.setState({
            ...this.state,
            unitsOfMeasurement: unit
        });
    }

    render() {  
        if(this.props.working){
            return (<LoadingIndicator />);
        }

        let { tender } = this.props.data;
        return (
            <div className="modal-content">
                <ModalHeader toggle={this.props.toggle}><i className="fas fa-keyboard mr-2"></i>Create Quick {getWellFormattedUtilityName(tender.utility)} Offer </ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="upload-offer-supplier">Supplier</Label>
                            <CustomInput type="select" name="upload-offer-supplier-picker" id="upload-offer-supplier"
                                   value={this.state.selectedSupplierId}
                                   onChange={(e) => this.handleFormChange("selectedSupplierId", e)}>
                                <option value="" disabled>Select</option>
                                {tender.assignedSuppliers.map(s => {
                                        return (<option key={s.supplierId} value={s.supplierId}>{s.name}</option>)
                                })}
                            </CustomInput>
                        </FormGroup>
                        
                        <Row>
                            <Col xs={6}>
                                <FormGroup>
                                    <Label for="quick-offer-duration-select">Duration</Label>
                                    <CustomInput type="select" 
                                                name="quick-offer-duration-picker" 
                                                id="quick-offer-duration-select"
                                                value={this.state.duration}
                                                onChange={(e) => this.handleFormChange("duration", e)}>
                                        <option value={0} disabled>Select</option>
                                        <option value={6}>6 Months</option>
                                        <option value={12}>12 Months</option>
                                        <option value={18}>18 Months</option>
                                        <option value={24}>24 Months</option>
                                        <option value={36}>36 Months</option>
                                        <option value={48}>48 Months</option>
                                        <option value={60}>60 Months</option>
                                    </CustomInput>
                                </FormGroup>
                            </Col>
                            <Col xs={6}>
                                <Label for="units-switcher-button">Standing Charge U.O.M.</Label>
                                <FormGroup>
                                    <ButtonGroup id="units-switcher-button">
                                        <Button color="white" className={cn({ active: this.state.unitsOfMeasurement === "POUNDS_PER_MONTH"})}
                                                onClick={() => this.handleUnitChange("POUNDS_PER_MONTH")}>
                                            £/month
                                        </Button>
                                        <Button color="white" className={cn({ active: this.state.unitsOfMeasurement === "PENCE_PER_KWH"})}
                                                onClick={() => this.handleUnitChange("PENCE_PER_KWH")}>
                                            p/kWh
                                        </Button>
                                        <Button color="white" className={cn({ active: this.state.unitsOfMeasurement === "PENCE_PER_DAY"})}
                                                onClick={() => this.handleUnitChange("PENCE_PER_DAY")}>
                                            p/day
                                        </Button>
                                    </ButtonGroup>
                                </FormGroup>
                            </Col>
                        </Row>

                        <div style={{overflowY: "auto", maxHeight: "300px"}}>
                            <Table borderless>
                                <thead>
                                    <tr className="border-bottom">
                                        <th className="border-right">Meter Number</th>
                                        <th>Rate</th>
                                        <th>Standing Charge</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.quoteEntries.map((qe, index) => {
                                        return (
                                            <tr key={qe.meterNumber}>
                                                <td className="border-right">{qe.meterNumber}</td>
                                                <td>
                                                    <InputGroup>    
                                                        <Input value={qe.rate}
                                                            type="number"
                                                            step="0.001"
                                                            onChange={(e) => this.handleEntryChange(qe.meterNumber, "rate", Number(e.target.value))} />
                                                        <InputGroupAddon addonType="append">
                                                            <Button color="white" 
                                                                    id={`copy-down-rate-${qe.meterNumber}`}
                                                                    onClick={() => this.copyDown(qe.meterNumber, "rate")}>
                                                                <i className="fas fa-angle-double-down"></i>
                                                            </Button>
                                                            { index == 0 && <UncontrolledTooltip target={`copy-down-rate-${qe.meterNumber}`} placement="bottom" autohide={false}>
                                                                <strong>Copy this rate value to the below meters</strong>
                                                            </UncontrolledTooltip> }
                                                        </InputGroupAddon>
                                                    </InputGroup>
                                                </td>
                                                <td>
                                                    <InputGroup>    
                                                        <Input value={qe.standingCharge}
                                                            type="number"
                                                            step="0.01"
                                                            onChange={(e) => this.handleEntryChange(qe.meterNumber, "standingCharge", Number(e.target.value))} />
                                                        <InputGroupAddon addonType="append">
                                                            <Button color="white" 
                                                                    id={`copy-down-standing-charge-${qe.meterNumber}`}
                                                                    onClick={() => this.copyDown(qe.meterNumber, "standingCharge")}>
                                                                <i className="fas fa-angle-double-down"></i>
                                                            </Button>
                                                            { index == 0 && <UncontrolledTooltip target={`copy-down-standing-charge-${qe.meterNumber}`} placement="bottom" autohide={false}>
                                                                <strong>Copy this standing charge value to the below meters</strong>
                                                            </UncontrolledTooltip> }
                                                        </InputGroupAddon>
                                                    </InputGroup>
                                                </td>
                                            </tr>);
                                    })}
                                </tbody>
                            </Table>
                        </div>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={this.props.toggle}>
                        <i className="fas fa-times mr-1"></i>Cancel
                    </Button>
                    <Button color="accent" 
                            disabled={!this.canSubmit()}
                            onClick={() => this.submit()}>
                        <i className="fas fa-arrow-circle-up mr-1"></i>Submit
                    </Button>
                </ModalFooter>
            </div>);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, QuickOfferDialogProps> = (dispatch) => {
    return {
        submitQuickQuote: (tenderId: string, quote: QuickQuote) => dispatch(submitQuickQuote(tenderId, quote))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, QuickOfferDialogProps, ApplicationState> = (state: ApplicationState) => {
    return {
        consumption: state.meters.consumption.value,
        
        working: state.meters.consumption.working,
        error: state.meters.consumption.error,
        errorMessage: state.meters.consumption.errorMessage,
    };
};
  
export default asModalDialog<QuickOfferDialogProps, StateProps, DispatchProps>(
{ 
    name: ModalDialogNames.QuickOffer, 
    centered: true, 
    backdrop: true,
}, mapStateToProps, mapDispatchToProps)(QuickOfferDialog)