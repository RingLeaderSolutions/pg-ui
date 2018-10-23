import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { Account } from '../../../model/Models';
import * as moment from 'moment';

import { updateAccount } from '../../../actions/hierarchyActions';
import { DayPickerWithMonthYear, TwoHundredthYearPast, Today } from "../../common/DayPickerHelpers";
import { Strings } from "../../../helpers/Utils";
import { ModalFooter, ModalHeader, ModalBody, Form, FormGroup, Label, Input, CustomInput, Button, Row } from "reactstrap";
import asModalDialog, { ModalDialogProps } from "../../common/modal/AsModalDialog";
import { ModalDialogNames } from "../../common/modal/ModalDialogNames";
import Col from "reactstrap/lib/Col";

export interface UpdateAccountDialogData {
    account: Account;
}

interface UpdateAccountDialogProps extends ModalDialogProps<UpdateAccountDialogData> { }

interface StateProps {
    working: boolean;
    error: boolean;
    errorMessage: string;
}

interface DispatchProps {
    updateAccount: (account: Account) => void;
}

interface UpdateAccountDialogState {
    companyName: string;
    companyReg: string;
    address: string;
    postcode: string;
    country: string;
    status: string;
    creditRating: string;
    vatEligible: boolean;
    registeredCharity: boolean;
    fitEligible: boolean;
    cclEligible: boolean;
    incorporationDate: moment.Moment;
}

class UpdateAccountDialog extends React.Component<UpdateAccountDialogProps & StateProps & DispatchProps, UpdateAccountDialogState> {
    constructor(props: UpdateAccountDialogProps & StateProps & DispatchProps){
        super(props);
        let { account } = props.data;
        this.state = {
            incorporationDate:  account.incorporationDate ? moment(account.incorporationDate) : null,
            companyName: account.companyName,
            companyReg: account.companyRegistrationNumber,
            address: account.address,
            postcode: account.postcode,
            country: account.countryOfOrigin,
            status: account.companyStatus,
            creditRating: account.creditRating,
            vatEligible: account.isVATEligible,
            registeredCharity: account.isRegisteredCharity,
            fitEligible: !account.hasFiTException,
            cclEligible: !account.hasCCLException
        };
    }

    updateAccount(){
        var account: Account = {
            id: this.props.data.account.id,
            accountNumber: null,
            contact: null,
            companyName: this.state.companyName,
            companyRegistrationNumber: this.state.companyReg,
            address: this.state.address,
            postcode: this.state.postcode,
            countryOfOrigin: this.state.country,
            incorporationDate: this.state.incorporationDate ? this.state.incorporationDate.format("YYYY-MM-DDTHH:mm:ss") : null,
            companyStatus: this.state.status,
            creditRating: this.state.creditRating,
            isVATEligible: this.state.vatEligible,
            isRegisteredCharity: this.state.registeredCharity,
            hasFiTException: !this.state.fitEligible,
            hasCCLException: !this.state.cclEligible,
        }
        
        this.props.updateAccount(account);
        this.props.toggle();
    }

    handleIncorporationDateChange(date: moment.Moment){
        this.setState({
            ...this.state,
            incorporationDate: date
        });
    }

    handleFormChange(attribute: string, event: React.ChangeEvent<any>, isCheck: boolean = false){
        var value = isCheck ? event.target.checked : event.target.value;

        this.setState({
            ...this.state,
            [attribute]: value
        })
    }

    canSubmit(){
        return Strings.AreNotNullOrEmpty(
            this.state.companyName,
            this.state.status);
    }

    render() {
        var { account } = this.props.data;
        return (
            <div className="modal-content">
                <ModalHeader toggle={this.props.toggle}><i className="material-icons mr-1">mode_edit</i>Update Account: {account.companyName}</ModalHeader>
                <ModalBody>
                    <Form>
                        <Row noGutters>
                            <Col xs={6} className="pr-2">
                                <FormGroup>
                                    <Label for="update-account-name">Company Name</Label>
                                    <Input id="update-account-name"
                                            value={this.state.companyName}
                                            onChange={(e) => this.handleFormChange("companyName", e)} />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="update-account-company-reg">Company Registration No.</Label>
                                    <Input id="update-account-company-reg"
                                            value={this.state.companyReg}
                                            onChange={(e) => this.handleFormChange("companyReg", e)} />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="update-account-address">Address</Label>
                                    <Input id="update-account-address"
                                            value={this.state.address}
                                            onChange={(e) => this.handleFormChange("address", e)} />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="update-account-postcode">Postcode</Label>
                                    <Input id="update-account-postcode"
                                            value={this.state.postcode}
                                            onChange={(e) => this.handleFormChange("postcode", e)} />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="update-account-country">Country</Label>
                                    <CustomInput type="select" name="update-account-country-picker" id="update-account-country"
                                            value={this.state.country}
                                            onChange={(e) => this.handleFormChange("country", e)}>
                                        <option value="" disabled>Select</option>
                                        <option value="United Kingdom">United Kingdom</option>
                                        <option value="Ireland">Ireland</option>
                                    </CustomInput>
                                </FormGroup>    
                            </Col>
                            <Col xs={6}>
                                <Label>Incorporation Date</Label>
                                <FormGroup>
                                    <DayPickerWithMonthYear 
                                        disableFuture={true} 
                                        fromMonth={TwoHundredthYearPast} 
                                        toMonth={Today} 
                                        onDayChange={(d: moment.Moment) => this.handleIncorporationDateChange(d)}
                                        selectedDay={this.state.incorporationDate} />
                                </FormGroup>   
                                <FormGroup>
                                    <Label for="update-account-status">Status</Label>
                                    <CustomInput type="select" name="update-account-status-picker" id="update-account-status"
                                            value={this.state.status}
                                            onChange={(e) => this.handleFormChange("status", e)}>
                                        <option value="" disabled>Select</option>
                                        <option value="Active">Active</option>
                                        <option value="On-boarding">On-boarding</option>
                                        <option value="Suspended">Suspended</option>
                                    </CustomInput>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="update-account-creditRating">Credit Rating</Label>
                                    <Input id="update-account-creditRating"
                                            value={this.state.creditRating}
                                            onChange={(e) => this.handleFormChange("creditRating", e)} />
                                </FormGroup>
                                <FormGroup>
                                    <div className="custom-toggle custom-control">
                                        <input type="checkbox" id="update-account-vat" className="custom-control-input"
                                                checked={this.state.vatEligible}
                                                onChange={(e) => this.handleFormChange("vatEligible", e)} />
                                        <Label className="custom-control-label" for="update-account-vat">VAT Eligible</Label>
                                    </div>
                                </FormGroup>
                                <FormGroup>
                                    <div className="custom-toggle custom-control">
                                        <input type="checkbox" id="update-account-regCharity" className="custom-control-input"
                                                checked={this.state.registeredCharity}
                                                onChange={(e) => this.handleFormChange("registeredCharity", e)} />
                                        <Label className="custom-control-label" for="update-account-regCharity">Registered Charity</Label>
                                    </div>
                                </FormGroup>
                                <FormGroup>
                                    <div className="custom-toggle custom-control">
                                        <input type="checkbox" id="update-account-fit" className="custom-control-input"
                                                checked={this.state.vatEligible}
                                                onChange={(e) => this.handleFormChange("fitEligible", e)} />
                                        <Label className="custom-control-label" for="update-account-fit">FiT Eligible</Label>
                                    </div>
                                </FormGroup>
                                <FormGroup>
                                    <div className="custom-toggle custom-control">
                                        <input type="checkbox" id="update-account-ccl" className="custom-control-input"
                                                checked={this.state.cclEligible}
                                                onChange={(e) => this.handleFormChange("cclEligible", e)} />
                                        <Label className="custom-control-label" for="update-account-ccl">CCL Eligible</Label>
                                    </div>
                                </FormGroup>                       
                            </Col>
                        </Row>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={this.props.toggle}>
                        <i className="fas fa-times mr-1"></i>Cancel
                    </Button>
                    <Button color="accent" 
                            disabled={!this.canSubmit()}
                            onClick={() => this.updateAccount()}>
                        <i className="material-icons mr-1">mode_edit</i>Save
                    </Button>
                </ModalFooter>
            </div>);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, UpdateAccountDialogProps> = (dispatch) => {
    return {
        updateAccount: (account: Account) =>  dispatch(updateAccount(account))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, UpdateAccountDialogProps, ApplicationState> = (state: ApplicationState) => {
    return {
        working: state.portfolio.details.working,
        error: state.portfolio.details.error,
        errorMessage: state.portfolio.details.errorMessage,
    };
};

export default asModalDialog(
{ 
    name: ModalDialogNames.UpdateAccount, 
    centered: true, 
    backdrop: true
}, mapStateToProps, mapDispatchToProps)(UpdateAccountDialog)