import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../../applicationState';
import { TenderSupplier, Tender, QuickQuoteEntry, QuickQuote } from "../../../../model/Tender";

import { uploadElectricityOffer, uploadGasOffer, submitQuickQuote } from '../../../../actions/tenderActions';
import { UploadPanel } from "../../../common/UploadPanel";
import { getWellFormattedUtilityName } from "../../../common/UtilityIcon";
import asModalDialog, { ModalDialogProps } from "../../../common/modal/AsModalDialog";
import { ModalDialogNames } from "../../../common/modal/ModalDialogNames";
import { ModalFooter, ModalHeader, ModalBody, Form, FormGroup, Label, CustomInput, Button, Table, Input, ButtonGroup } from "reactstrap";
import { fetchMeterConsumption } from "../../../../actions/meterActions";
import { LoadingIndicator } from "../../../common/LoadingIndicator";
import { MeterConsumptionSummary } from "../../../../model/Meter";
import * as cn from "classnames";

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
    quoteEntries: QuickQuoteEntry[];
}

class QuickOfferDialog extends React.Component<QuickOfferDialogProps & StateProps & DispatchProps, UploadOfferState> {
    constructor(props: QuickOfferDialogProps & StateProps & DispatchProps){
        super(props);

        let { tender, consumption } = props.data;
        let lowerUtility = tender.utility.toLowerCase();
        let quoteEntries: QuickQuoteEntry[] = [];
        
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

    createQuoteEntryFromConsumption(consumption: string[]): QuickQuoteEntry {
        return {
            meterNumber: consumption[1],
            duration: 0,
            rate: 0,
            standingCharge: 0,
            standingChargeUOM: ""
        };
    }

    submit() {
        let { tender } = this.props.data;

        let quote: QuickQuote = {
            supplierId: this.state.selectedSupplierId,
            prices: this.state.quoteEntries.map(qe => {
                return { ...qe, standingChargeUOM: this.state.unitsOfMeasurement, duration: Number(this.state.duration) };
            })
        };

        this.props.submitQuickQuote(tender.tenderId, quote);
        this.props.toggle();
    }

    canSubmit(){
        return !this.state.selectedSupplierId.IsNullOrEmpty()
            && this.state.quoteEntries.every(qe => qe.rate > 0 && qe.standingCharge > 0);
    }
    
    handleEntryChange(meterNumber: string, attribute: string, value: any) {
        let entryIndex = this.state.quoteEntries.findIndex(qe => qe.meterNumber === meterNumber);
        
        const entryCopy = {...this.state.quoteEntries[entryIndex]};
        entryCopy[attribute] = value;

        let entries = [
            ...this.state.quoteEntries.slice(0, entryIndex),
            entryCopy,
            ...this.state.quoteEntries.slice(entryIndex + 1),
        ];

        this.setState({
            ...this.state,
            quoteEntries: entries
        })
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
                        
                        <Label for="units-switcher-button">Unit of Measurement:</Label>
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

                        <FormGroup>
                            <Label for="quick-offer-duration-select">Duration:</Label>
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
                                    {this.state.quoteEntries.map(qe => {
                                        return (
                                            <tr key={qe.meterNumber}>
                                                <td className="border-right">{qe.meterNumber}</td>
                                                <td>
                                                    <Input value={qe.rate}
                                                        type="number"
                                                        step="0.001"
                                                        onChange={(e) => this.handleEntryChange(qe.meterNumber, "rate", Number(e.target.value))} />
                                                </td>
                                                <td>
                                                    <Input value={qe.standingCharge}
                                                        type="number"
                                                        step="0.01"
                                                        onChange={(e) => this.handleEntryChange(qe.meterNumber, "standingCharge", Number(e.target.value))} />
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
  
export default asModalDialog(
{ 
    name: ModalDialogNames.QuickOffer, 
    centered: true, 
    backdrop: true,
}, mapStateToProps, mapDispatchToProps)(QuickOfferDialog)