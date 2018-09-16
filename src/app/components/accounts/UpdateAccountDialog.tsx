import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../applicationState';
import { Account } from '../../model/Models';
import * as moment from 'moment';

import { updateAccount } from '../../actions/hierarchyActions';
import { closeModalDialog } from "../../actions/viewActions";
import { DayPickerWithMonthYear, HundredthYearPast, Today } from "../common/DayPickerHelpers";
import { StringsAreNotNullOrEmpty } from "../../helpers/ValidationHelpers";

interface UpdateAccountDialogProps {    
    account: Account;
}

interface StateProps {
  working: boolean;
  error: boolean;
  errorMessage: string;
}

interface DispatchProps {
    updateAccount: (account: Account) => void;
    closeModalDialog: () => void;
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
        super();
        this.state = {
            incorporationDate:  props.account.incorporationDate ? moment(props.account.incorporationDate) : moment(),
            companyName: props.account.companyName,
            companyReg: props.account.companyRegistrationNumber,
            address: props.account.address,
            postcode: props.account.postcode,
            country: props.account.countryOfOrigin,
            status: props.account.companyStatus,
            creditRating: props.account.creditRating,
            vatEligible: props.account.isVATEligible,
            registeredCharity: props.account.isRegisteredCharity,
            fitEligible: !props.account.hasFiTException,
            cclEligible: !props.account.hasCCLException
        };
    }

    updateAccount(){
        var account: Account = {
            id: this.props.account.id,
            accountNumber: null,
            contact: null,
            companyName: this.state.companyName,
            companyRegistrationNumber: this.state.companyReg,
            address: this.state.address,
            postcode: this.state.postcode,
            countryOfOrigin: this.state.country,
            incorporationDate: this.state.incorporationDate.format("YYYY-MM-DDTHH:mm:ss"),
            companyStatus: this.state.status,
            creditRating: this.state.creditRating,
            isVATEligible: this.state.vatEligible,
            isRegisteredCharity: this.state.registeredCharity,
            hasFiTException: !this.state.fitEligible,
            hasCCLException: !this.state.cclEligible,
        }
        
        this.props.updateAccount(account);
        this.props.closeModalDialog();
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
        return StringsAreNotNullOrEmpty(
            this.state.companyName,
            this.state.status);
    }

    render() {
        var { account } = this.props;
        return (
            <div>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title"><i className="fa fa-building uk-margin-right"></i>Edit Account: {account.companyName}</h2>
                </div>
                <div className="uk-modal-body">
                    <div className="uk-margin">
                        <form>
                        <fieldset className="uk-fieldset">
                                <div className="uk-grid" data-uk-grid>
                                    <div className="uk-width-1-2">
                                        <div className='uk-margin'>
                                            <label className='uk-form-label'>Company Name</label>
                                            <input 
                                                className='uk-input' 
                                                type='text' 
                                                value={this.state.companyName}
                                        onChange={(e) => this.handleFormChange("companyName", e)} />
                                        </div>
                                        <div className='uk-margin'>
                                            <label className='uk-form-label'>Company Registration No.</label>
                                            <input 
                                                className='uk-input' 
                                                type='text' 
                                                value={this.state.companyReg}
                                                onChange={(e) => this.handleFormChange("companyReg", e)} />
                                        </div>
                                        <div className='uk-margin'>
                                            <label className='uk-form-label'>Address</label>
                                            <input 
                                                className='uk-input' 
                                                type='text' 
                                                value={this.state.address}
                                                onChange={(e) => this.handleFormChange("address", e)} />
                                        </div>
                                        <div className='uk-margin'>
                                            <label className='uk-form-label'>Postcode</label>
                                            <input 
                                                className='uk-input' 
                                                type='text' 
                                                value={this.state.postcode}
                                                onChange={(e) => this.handleFormChange("postcode", e)} />
                                        </div>
                                        <div className='uk-margin'>
                                            <label className='uk-form-label'>Country</label>
                                            <select className='uk-select' 
                                                value={this.state.country}
                                                onChange={(e) => this.handleFormChange("country", e)}>
                                                <option value="" disabled>Select</option>
                                                <option value="United Kingdom">United Kingdom</option>
                                                <option value="Ireland">Ireland</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="uk-width-1-2">
                                        <div className="uk-margin">
                                            <label className="uk-form-label" data-for="deadline-input">Incorporation Date</label>
                                            <div className="uk-form-controls">
                                                <div id="deadline-input">
                                                    <DayPickerWithMonthYear 
                                                        disableFuture={true} 
                                                        fromMonth={HundredthYearPast} 
                                                        toMonth={Today} 
                                                        onDayChange={(d: moment.Moment) => this.handleIncorporationDateChange(d)}
                                                        selectedDay={this.state.incorporationDate} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='uk-margin'>
                                            <label className='uk-form-label'>Status</label>
                                            <select className='uk-select' 
                                                value={this.state.status}
                                                onChange={(e) => this.handleFormChange("status", e)}>
                                                <option value="" disabled>Select</option>
                                                <option value="Active">Active</option>
                                                <option value="On-boarding">On-boarding</option>
                                                <option value="Suspended">Suspended</option>
                                            </select>
                                        </div>
                                        <div className='uk-margin'>
                                            <label className='uk-form-label'>Credit Rating</label>
                                            <input 
                                                className='uk-input' 
                                                type='text' 
                                                value={this.state.creditRating}
                                                onChange={(e) => this.handleFormChange("creditRating", e)} />
                                        </div>
                                        <div className='uk-margin'>
                                            <label>
                                                <input 
                                                    className='uk-checkbox'
                                                    type='checkbox' 
                                                    checked={this.state.vatEligible}
                                                    onChange={(e) => this.handleFormChange("vatEligible", e, true)}
                                                    /> Is VAT Eligible
                                            </label>
                                        </div>
                                        <div className='uk-margin'>
                                            <label>
                                                <input 
                                                    className='uk-checkbox'
                                                    type='checkbox' 
                                                    checked={this.state.registeredCharity}
                                                    onChange={(e) => this.handleFormChange("registeredCharity", e, true)}
                                                    /> Is Registered Charity
                                            </label>
                                        </div>
                                        <div className='uk-margin'>
                                            <label>
                                                <input 
                                                    className='uk-checkbox'
                                                    type='checkbox' 
                                                    checked={this.state.fitEligible}
                                                    onChange={(e) => this.handleFormChange("fitEligible", e, true)}
                                                    /> Is FiT Eligible
                                            </label>
                                        </div>
                                        <div className='uk-margin'>
                                            <label>
                                                <input 
                                                    className='uk-checkbox'
                                                    type='checkbox' 
                                                    checked={this.state.cclEligible}
                                                    onChange={(e) => this.handleFormChange("cclEligible", e, true)}
                                                    /> Is CCL Eligible
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                        </form>
                    </div>
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-right" type="button" onClick={() => this.props.closeModalDialog()}><i className="fa fa-times uk-margin-small-right"></i>Cancel</button>
                    <button className="uk-button uk-button-primary" type="button" onClick={() => this.updateAccount()} disabled={!this.canSubmit()}><i className="fa fa-edit uk-margin-small-right"></i>Save</button>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, UpdateAccountDialogProps> = (dispatch) => {
    return {
        updateAccount: (account: Account) =>  dispatch(updateAccount(account)),
        closeModalDialog: () => dispatch(closeModalDialog())
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, UpdateAccountDialogProps> = (state: ApplicationState) => {
    return {
        working: state.portfolio.details.working,
        error: state.portfolio.details.error,
        errorMessage: state.portfolio.details.errorMessage,
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(UpdateAccountDialog);