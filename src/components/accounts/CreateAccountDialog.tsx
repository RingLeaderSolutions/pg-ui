import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../applicationState';
import { Account, CompanyInfo } from '../../model/Models';
import * as moment from 'moment';
import DatePicker from 'react-datepicker';

import { createAccount } from '../../actions/hierarchyActions';

interface CreateAccountDialogProps {    
}

interface StateProps {
    company: CompanyInfo;
}

interface DispatchProps {
    createAccount: (account: Account) => void;
}

interface CreateAccountDialogState {
    incorporationDate: moment.Moment;
}

class CreateAccountDialog extends React.Component<CreateAccountDialogProps & StateProps & DispatchProps, CreateAccountDialogState> {
    constructor(props: CreateAccountDialogProps & StateProps & DispatchProps){
        super();
        this.state = {
            incorporationDate: props.company ? moment(props.company.incorporationDate, "DD-MM-YYYY") : moment()
        };

        this.handleIncorporationDateChange = this.handleIncorporationDateChange.bind(this);
        this.createAccount = this.createAccount.bind(this);
    }

    companyName: HTMLInputElement;
    companyReg: HTMLInputElement;
    address: HTMLInputElement;
    postcode: HTMLInputElement;
    country: HTMLInputElement;
    status: HTMLInputElement;
    creditRating: HTMLInputElement;
    vatEligible: HTMLInputElement;
    registeredCharity: HTMLInputElement;
    fitEligible: HTMLInputElement;
    cclEligible: HTMLInputElement;

    createAccount(event: any){
        var account: Account = {
            id: null,
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
        
        this.props.createAccount(account);
        event.preventDefault();        
    }

    handleIncorporationDateChange(date: moment.Moment, event: React.SyntheticEvent<any>){
        this.setState({
            incorporationDate: date
        });

        event.preventDefault();
    }

    render() {
        var { company } = this.props;
        var address = company ? `${company.addressLine1}, ${company.addressLine2}, ${company.postTown}, ${company.county}` : null;

        return (
            <div>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title">Create Account</h2>
                </div>
                <div className="uk-modal-body">
                    <div className="uk-margin">
                        <form>
                            <fieldset className="uk-fieldset">
                                <div className='uk-margin'>
                                    <label className='uk-form-label'>Company Name</label>
                                    <input 
                                        className='uk-input' 
                                        type='text' 
                                        defaultValue={company ? company.companyName : null}
                                        ref={ref => this.companyName = ref} />
                                </div>
                                <div className='uk-margin'>
                                    <label className='uk-form-label'>Company Registration No.</label>
                                    <input 
                                        className='uk-input' 
                                        type='text' 
                                        defaultValue={company ? company.companyNumber : null}
                                        ref={ref => this.companyReg = ref} />
                                </div>
                                <div className='uk-margin'>
                                    <label className='uk-form-label'>Address</label>
                                    <input 
                                        className='uk-input' 
                                        type='text' 
                                        defaultValue={address}
                                        ref={ref => this.address = ref} />
                                </div>
                                <div className='uk-margin'>
                                    <label className='uk-form-label'>Postcode</label>
                                    <input 
                                        className='uk-input' 
                                        type='text' 
                                        defaultValue={company ? company.postcode : null}
                                        ref={ref => this.postcode = ref} />
                                </div>
                                <div className='uk-margin'>
                                    <label className='uk-form-label'>Country</label>
                                    <input 
                                        className='uk-input' 
                                        type='text' 
                                        defaultValue={company ? company.countryOfOrigin : null}
                                        ref={ref => this.country = ref} />
                                </div>
                                <div className="uk-margin">
                                <label className="uk-form-label" data-for="deadline-input">Incorporation Date</label>
                                <div className="uk-form-controls">
                                    <DatePicker id="deadline-input"
                                                className="uk-input"
                                                selected={this.state.incorporationDate}
                                                onChange={this.handleIncorporationDateChange}/>
                                </div>
                            </div>
                                <div className='uk-margin'>
                                    <label className='uk-form-label'>Status</label>
                                    <input 
                                        className='uk-input' 
                                        type='text' 
                                        ref={ref => this.status = ref} />
                                </div>
                                <div className='uk-margin'>
                                    <label className='uk-form-label'>Credit Rating</label>
                                    <input 
                                        className='uk-input' 
                                        type='text' 
                                        ref={ref => this.creditRating = ref} />
                                </div>
                                <div className='uk-margin'>
                                    <label>
                                        <input 
                                            className='uk-checkbox'
                                            type='checkbox' 
                                            defaultChecked={true}
                                            ref={ref => this.vatEligible = ref}
                                            /> Is VAT Eligible
                                    </label>
                                </div>
                                <div className='uk-margin'>
                                    <label>
                                        <input 
                                            className='uk-checkbox'
                                            type='checkbox' 
                                            defaultChecked={false}
                                            ref={ref => this.registeredCharity = ref}
                                            /> Is Registered Charity
                                    </label>
                                </div>
                                <div className='uk-margin'>
                                    <label>
                                        <input 
                                            className='uk-checkbox'
                                            type='checkbox' 
                                            defaultChecked={false}
                                            ref={ref => this.fitEligible = ref}
                                            /> Is FiT Eligible
                                    </label>
                                </div>
                                <div className='uk-margin'>
                                    <label>
                                        <input 
                                            className='uk-checkbox'
                                            type='checkbox' 
                                            defaultChecked={false}
                                            ref={ref => this.cclEligible = ref}
                                            /> Is CCL Eligible
                                    </label>
                                </div>
                            </fieldset>
                        </form>
                    </div>
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-primary" type="button" onClick={this.createAccount}>Create</button>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, CreateAccountDialogProps> = (dispatch) => {
    return {
        createAccount: (account: Account) =>  dispatch(createAccount(account))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, CreateAccountDialogProps> = (state: ApplicationState) => {
    return {
        company: state.hierarchy.create_account.company.value
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(CreateAccountDialog);