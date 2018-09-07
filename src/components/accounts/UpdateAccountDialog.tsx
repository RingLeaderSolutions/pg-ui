import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../applicationState';
import { Account } from '../../model/Models';
import * as moment from 'moment';

import { updateAccount } from '../../actions/hierarchyActions';
import { closeModalDialog } from "../../actions/viewActions";
import { DayPickerWithMonthYear, HundredthYearPast, Today } from "../common/DayPickerHelpers";

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
    incorporationDate: moment.Moment;
}

class UpdateAccountDialog extends React.Component<UpdateAccountDialogProps & StateProps & DispatchProps, UpdateAccountDialogState> {
    constructor(props: UpdateAccountDialogProps & StateProps & DispatchProps){
        super();
        this.state = {
            incorporationDate: props.account.incorporationDate ? moment(props.account.incorporationDate) : moment(),
        };

        this.handleIncorporationDateChange = this.handleIncorporationDateChange.bind(this);
    }

    companyName: HTMLInputElement;
    companyReg: HTMLInputElement;
    address: HTMLInputElement;
    postcode: HTMLInputElement;
    country: HTMLSelectElement;
    status: HTMLSelectElement;
    creditRating: HTMLInputElement;
    vatEligible: HTMLInputElement;
    registeredCharity: HTMLInputElement;
    fitEligible: HTMLInputElement;
    cclEligible: HTMLInputElement;

    updateAccount(){
        var account: Account = {
            id: this.props.account.id,
            accountNumber: null,
            contact: null,
            companyName: this.companyName.value,
            companyRegistrationNumber: this.companyReg.value,
            address: this.address.value,
            postcode: this.postcode.value,
            countryOfOrigin: this.country.value,
            incorporationDate: this.state.incorporationDate.format("YYYY-MM-DDTHH:mm:ss"),
            companyStatus: this.status.value,
            creditRating: this.creditRating.value,
            isVATEligible: this.vatEligible.checked,
            isRegisteredCharity: this.registeredCharity.checked,
            hasFiTException: !this.fitEligible.checked,
            hasCCLException: !this.cclEligible.checked,
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

    render() {
        var { account } = this.props;
        return (
            <div>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title">Update Account: {account.companyName}</h2>
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
                                                defaultValue={account.companyName}
                                                ref={ref => this.companyName = ref} />
                                        </div>
                                        <div className='uk-margin'>
                                            <label className='uk-form-label'>Company Registration No.</label>
                                            <input 
                                                className='uk-input' 
                                                type='text' 
                                                defaultValue={account.companyRegistrationNumber}
                                                ref={ref => this.companyReg = ref} />
                                        </div>
                                        <div className='uk-margin'>
                                            <label className='uk-form-label'>Address</label>
                                            <input 
                                                className='uk-input' 
                                                type='text' 
                                                defaultValue={account.address}
                                                ref={ref => this.address = ref} />
                                        </div>
                                        <div className='uk-margin'>
                                            <label className='uk-form-label'>Postcode</label>
                                            <input 
                                                className='uk-input' 
                                                type='text' 
                                                defaultValue={account.postcode}
                                                ref={ref => this.postcode = ref} />
                                        </div>
                                        <div className='uk-margin'>
                                            <label className='uk-form-label'>Country</label>
                                            <select className='uk-select' 
                                                defaultValue={account.countryOfOrigin}
                                                ref={ref => this.country = ref}>
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
                                                <DayPickerWithMonthYear 
                                                            disableFuture={true} 
                                                            fromMonth={HundredthYearPast} 
                                                            toMonth={Today} 
                                                            onDayChange={(d: moment.Moment) => this.handleIncorporationDateChange(d)}
                                                            selectedDay={this.state.incorporationDate} />
                                            </div>
                                        </div>
                                        <div className='uk-margin'>
                                            <label className='uk-form-label'>Status</label>
                                            <select className='uk-select' 
                                                defaultValue={account.companyStatus}
                                                ref={ref => this.status = ref}>
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
                                                defaultValue={account.creditRating}
                                                ref={ref => this.creditRating = ref} />
                                        </div>
                                        <div className='uk-margin'>
                                            <label>
                                                <input 
                                                    className='uk-checkbox'
                                                    type='checkbox' 
                                                    defaultChecked={account.isVATEligible}
                                                    ref={ref => this.vatEligible = ref}
                                                    /> Is VAT Eligible
                                            </label>
                                        </div>
                                        <div className='uk-margin'>
                                            <label>
                                                <input 
                                                    className='uk-checkbox'
                                                    type='checkbox' 
                                                    defaultChecked={account.isRegisteredCharity}
                                                    ref={ref => this.registeredCharity = ref}
                                                    /> Is Registered Charity
                                            </label>
                                        </div>
                                        <div className='uk-margin'>
                                            <label>
                                                <input 
                                                    className='uk-checkbox'
                                                    type='checkbox' 
                                                    defaultChecked={!account.hasFiTException}
                                                    ref={ref => this.fitEligible = ref}
                                                    /> Is FiT Eligible
                                            </label>
                                        </div>
                                        <div className='uk-margin'>
                                            <label>
                                                <input 
                                                    className='uk-checkbox'
                                                    type='checkbox' 
                                                    defaultChecked={!account.hasCCLException}
                                                    ref={ref => this.cclEligible = ref}
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
                    <button className="uk-button uk-button-default uk-margin-right" type="button" onClick={() => this.props.closeModalDialog()}>Cancel</button>
                    <button className="uk-button uk-button-primary" type="button" onClick={() => this.updateAccount()}>Save</button>
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