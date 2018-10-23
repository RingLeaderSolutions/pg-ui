import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { Account, CompanyInfo } from '../../../model/Models';
import * as moment from 'moment';

import { createAccount, clearAccountCreation } from '../../../actions/hierarchyActions';
import { Today, TwoHundredthYearPast, DayPickerWithMonthYear } from "../../common/DayPickerHelpers";
import { Strings } from "../../../helpers/Utils";
import { ModalHeader, ModalBody, Form, Row, Col, FormGroup, Label, Input, CustomInput, ModalFooter, Button } from "reactstrap";

interface CreateAccountDialogProps {    
    toggle: () => void;
}

interface StateProps {
    company: CompanyInfo;
}

interface DispatchProps {
    createAccount: (account: Account) => void;
    clearAccountCreation: () => void;
}

interface CreateAccountDialogState {
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

class CreateAccountDialog extends React.Component<CreateAccountDialogProps & StateProps & DispatchProps, CreateAccountDialogState> {
    constructor(props: CreateAccountDialogProps & StateProps & DispatchProps){
        super(props);
        this.state = this.getStateFromCompany(props.company);
    }

    getStateFromCompany(company: CompanyInfo) : CreateAccountDialogState {
        var defaults: CreateAccountDialogState = {
            incorporationDate: null,
            companyName: '',
            companyReg: '',
            address: '',
            postcode: '',
            country: '',
            status: '',
            creditRating: '',
            vatEligible: true,
            registeredCharity: false,
            fitEligible: true,
            cclEligible: true
        };

        if(company != null){
            return {
                ...defaults,
                incorporationDate: company.incorporationDate ? moment(company.incorporationDate, "DD-MM-YYYY") : null,
                companyName: company.companyName,
                companyReg: company.companyNumber,
                address: [company.addressLine1, company.addressLine2, company.postTown, company.county]
                        .filter(s => s != null && s != "")
                        .join(', '),
                country: this.tryMapCountry(company.countryOfOrigin),
                postcode: company.postcode || ''
            }
        }

        return defaults;
    }

    tryMapCountry(country: string){
        switch(country.toLowerCase()){
            case "uk":
            case "united kingdom":
            case "great britain":
                return "United Kingdom";
            case "ireland":
            case "ie":
                return "Ireland";
            default:
                return '';
        }
    }

    createAccount(){
        var account: Account = {
            id: null,
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
        
        this.props.createAccount(account);   
    }

    handleIncorporationDateChange(d: moment.Moment){
        this.setState({
            ...this.state,
            incorporationDate: d
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

    close(){
        this.props.clearAccountCreation();
        this.props.toggle();
    }

    render() {
        return(
            <div className="modal-content">
                <ModalHeader toggle={() => this.close()}><i className="fas fa-building mr-2"></i>Create Account</ModalHeader>
                <ModalBody>
                    <Form>
                        <Row noGutters>
                            <Col xs={6} className="pr-2">
                                <FormGroup>
                                    <Label for="new-account-name">Company Name</Label>
                                    <Input id="new-account-name"
                                            value={this.state.companyName}
                                            onChange={(e) => this.handleFormChange("companyName", e)} />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="new-account-company-reg">Company Registration No.</Label>
                                    <Input id="new-account-company-reg"
                                            value={this.state.companyReg}
                                            onChange={(e) => this.handleFormChange("companyReg", e)} />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="new-account-address">Address</Label>
                                    <Input id="new-account-address"
                                            value={this.state.address}
                                            onChange={(e) => this.handleFormChange("address", e)} />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="new-account-postcode">Postcode</Label>
                                    <Input id="new-account-postcode"
                                            value={this.state.postcode}
                                            onChange={(e) => this.handleFormChange("postcode", e)} />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="new-account-country">Country</Label>
                                    <CustomInput type="select" name="new-account-country-picker" id="new-account-country"
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
                                    <Label for="new-account-status">Status</Label>
                                    <CustomInput type="select" name="new-account-status-picker" id="new-account-status"
                                            value={this.state.status}
                                            onChange={(e) => this.handleFormChange("status", e)}>
                                        <option value="" disabled>Select</option>
                                        <option value="Active">Active</option>
                                        <option value="On-boarding">On-boarding</option>
                                        <option value="Suspended">Suspended</option>
                                    </CustomInput>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="new-account-creditRating">Credit Rating</Label>
                                    <Input id="new-account-creditRating"
                                            value={this.state.creditRating}
                                            onChange={(e) => this.handleFormChange("creditRating", e)} />
                                </FormGroup>
                                <FormGroup>
                                    <div className="custom-toggle custom-control">
                                        <input type="checkbox" id="new-account-vat" className="custom-control-input"
                                                checked={this.state.vatEligible}
                                                onChange={(e) => this.handleFormChange("vatEligible", e)} />
                                        <Label className="custom-control-label" for="new-account-vat">VAT Eligible</Label>
                                    </div>
                                </FormGroup>
                                <FormGroup>
                                    <div className="custom-toggle custom-control">
                                        <input type="checkbox" id="new-account-regCharity" className="custom-control-input"
                                                checked={this.state.registeredCharity}
                                                onChange={(e) => this.handleFormChange("registeredCharity", e)} />
                                        <Label className="custom-control-label" for="new-account-regCharity">Registered Charity</Label>
                                    </div>
                                </FormGroup>
                                <FormGroup>
                                    <div className="custom-toggle custom-control">
                                        <input type="checkbox" id="new-account-fit" className="custom-control-input"
                                                checked={this.state.vatEligible}
                                                onChange={(e) => this.handleFormChange("fitEligible", e)} />
                                        <Label className="custom-control-label" for="new-account-fit">FiT Eligible</Label>
                                    </div>
                                </FormGroup>
                                <FormGroup>
                                    <div className="custom-toggle custom-control">
                                        <input type="checkbox" id="new-account-ccl" className="custom-control-input"
                                                checked={this.state.cclEligible}
                                                onChange={(e) => this.handleFormChange("cclEligible", e)} />
                                        <Label className="custom-control-label" for="new-account-ccl">CCL Eligible</Label>
                                    </div>
                                </FormGroup>                       
                            </Col>
                        </Row>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={() => this.close()}>
                        <i className="fas fa-times mr-1"></i>Cancel
                    </Button>
                    <Button color="accent" 
                            disabled={!this.canSubmit()}
                            onClick={() => this.createAccount()}>
                        <i className="fas fa-plus-circle mr-1"></i>Create
                    </Button>
                </ModalFooter>
            </div>);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, CreateAccountDialogProps> = (dispatch) => {
    return {
        createAccount: (account: Account) =>  dispatch(createAccount(account)),
        clearAccountCreation: () => dispatch(clearAccountCreation())
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, CreateAccountDialogProps, ApplicationState> = (state: ApplicationState) => {
    return {
        company: state.hierarchy.create_account.company.value
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(CreateAccountDialog);