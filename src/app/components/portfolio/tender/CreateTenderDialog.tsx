import * as React from "react";
import { UtilityType } from '../../../model/Models';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import Spinner from '../../common/Spinner';
import * as moment from 'moment';

import { fetchTariffs } from '../../../actions/portfolioActions';
import { createTender } from '../../../actions/tenderActions';
import { Tender, TenderRequirements, Tariff, TenderOfferType } from "../../../model/Tender";
import { closeModalDialog } from "../../../actions/viewActions";
import { TenthYearFuture, DayPickerWithMonthYear, Today } from "../../common/DayPickerHelpers";


interface CreateTenderDialogProps {
    portfolioId: string;
    utilityDescription: string;
    utility: UtilityType;
    isHalfHourly: boolean;
}

interface StateProps {
    working: boolean;
    error: boolean;
    errorMessage: string;
    tariffs: Tariff[];    
}
  
interface DispatchProps {
    createTender: (portfolioId: string, tender: Tender, utilityTypE: UtilityType, isHalfHourly: boolean) => void;
    fetchTariffs: () => void;    
    closeModalDialog: () => void;
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
}

class CreateTenderDialog extends React.Component<CreateTenderDialogProps & StateProps & DispatchProps, CreateTenderState> {
    constructor(props: CreateTenderDialogProps & StateProps & DispatchProps){
        super();
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
            commissionPerMonth: ''
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
                <div className="uk-width-1-3 uk-margin-small" key={d}>
                    <label>
                        <input 
                            className='uk-checkbox'
                            type='checkbox' 
                            checked={this.stateHasDuration(d)}
                            onChange={(e) => this.handleOfferTypeChange(d, e)}
                            /> {d} months
                    </label>
                </div>
            )
        })
    }

    createTender(){
        let requirements: TenderRequirements = {
            id: "",
            portfolioId: this.props.portfolioId,
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
            portfolioId: this.props.portfolioId,
            utility: this.props.utility == UtilityType.Electricity ? "ELECTRICITY" : "GAS",

            tenderTitle: this.state.title,
            billingMethod: this.state.billingMethod,
            deadline: this.state.deadline ? this.state.deadline.format("YYYY-MM-DDTHH:mm:ss") : null,
            deadlineNotes: this.state.deadlineNotes,
            commission: Number(this.state.commission),
            commissionPerMonth: Number(this.state.commissionPerMonth),
            paymentMethod: this.state.paymentMethod,
            halfHourly: this.props.isHalfHourly,
            allInclusive: this.state.ebInclusive,
            offerTypes,
            requirements
        }

        this.props.createTender(this.props.portfolioId, tender, this.props.utility, this.props.isHalfHourly);
        this.props.closeModalDialog();
    }

    renderRequirementsEditForm(){
        var isGasTender = this.props.utility == UtilityType.Gas;
        var isHalfhourly = this.props.isHalfHourly;
        return (
            <form>
                <fieldset className='uk-fieldset'>
                    <div className="uk-grid" data-uk-grid>
                        <div className="uk-width-1-2">
                            <div className="uk-margin">
                                <label className="uk-form-label" data-for="payment-terms-select">Payment Terms</label>
                                <div className="uk-form-controls">
                                    <select className="uk-select" id="payment-terms-select" 
                                        value={this.state.paymentTerms}
                                        onChange={(e) => this.handleFormChange("paymentTerms", e)}>
                                        <option value="0" disabled>Select terms</option>
                                        <option value={7}>7 days</option>
                                        <option value={14}>14 days</option>
                                        <option value={21}>21 days</option>
                                        <option value={28}>28 days</option>
                                    </select>
                                </div>
                            </div>

                            { !isGasTender && isHalfhourly ? (
                            <div className="uk-margin">
                                <label className="uk-form-label" data-for="tariff-select">Tariff</label>
                                <div className="uk-form-controls">
                                    <select className="uk-select" id="tariff-select"
                                        value={this.state.tariff}
                                        onChange={(e) => this.handleFormChange("tariff", e)}>
                                        <option value="" disabled>Select tariff</option>                                            
                                        {this.renderTariffOptions()}
                                    </select>
                                </div>
                            </div>) : null}
                        </div>

                        <div className="uk-width-1-2">
                            <div className="uk-margin">
                                <label className="uk-form-label" data-for="green-perc-input">Green %</label>
                                <div className="uk-form-controls">
                                    <input className="uk-input" id="green-perc-input" type="text" placeholder="e.g. 20" 
                                        value={this.state.greenPercentage}
                                        onChange={(e) => this.handleFormChange("greenPercentage", e)}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div>
                        { !isGasTender ? (
                            <div>
                                <div className='uk-margin'>
                                    <label className='uk-form-label'>Embedded Benefits</label>
                                    <div className="uk-margin-small">
                                        <label><input className="uk-radio" type="radio" name="ebChoice" checked={this.state.ebInclusive} onChange={(e) => this.handleInclusiveChange(false, e)}/> Inclusive</label>
                                        <label><input className="uk-radio uk-margin-large-left" type="radio" name="ebChoice" checked={!this.state.ebInclusive} onChange={(e) => this.handleInclusiveChange(true, e)} /> Pass-Through</label>
                                    </div>
                                </div>
                                <hr />
                            </div>)
                        : null}
                        <label className="uk-form-label">Requested Offer Durations</label>
                        <div className="uk-grid uk-margin" data-uk-grid>
                            <div className='uk-width-1-3 uk-margin-small uk-margin-small-top'>
                                <label>
                                    <input 
                                        className='uk-checkbox'
                                        type='checkbox' 
                                        checked={this.stateHasDuration(0)}
                                        onChange={(e) => this.handleOfferTypeChange(0, e)}
                                        /> 0 (Flexi)
                                </label>
                            </div>
                            {this.renderDurationOptions(6, 12, 18, 24, 36, 48, 60)}
                        </div>

                    </div>
                </fieldset>
            </form>
        );
    }

    renderGeneralEditForm(){ 
        return (
            <form>
                <fieldset className='uk-fieldset'>
                    <div className='uk-margin'>
                        <label className='uk-form-label'>Title</label>
                        <input className='uk-input' 
                            value={this.state.title}
                            onChange={(e) => this.handleFormChange("title", e)}/>
                    </div>
                    
                    <div className="uk-margin uk-width-1-2">
                        <label className="uk-form-label" data-for="deadline-input">Deadline</label>
                        <div className="uk-form-controls">
                            <DayPickerWithMonthYear 
                                disablePast={true} 
                                fromMonth={Today} 
                                toMonth={TenthYearFuture} 
                                onDayChange={(d: moment.Moment) => this.handleDeadlineChange(d)}
                                selectedDay={this.state.deadline} />
                        </div>
                    </div>

                    <div className='uk-margin'>
                        <label className='uk-form-label'>Deadline notes</label>
                        <textarea className='uk-textarea' 
                            rows={4}
                            value={this.state.deadlineNotes}
                            onChange={(e) => this.handleFormChange("deadlineNotes", e)}/>
                    </div>

                    <div className="uk-margin">
                        <label className='uk-form-label'>Commission</label>
                        <div className="uk-grid">
                            <div className="uk-grid uk-grid-collapse uk-width-1-2">
                                <div className="uk-width-expand uk-flex uk-flex-middle">
                                    <input className='uk-input' 
                                        placeholder="e.g. 0.1"
                                        value={this.state.commission}
                                        onChange={(e) => this.handleFormChange("commission", e)}/>
                                </div>
                                <div className="uk-width-auto uk-flex uk-flex-middle">
                                    <p className="uk-margin-small-left">p/kWh</p>
                                </div>
                            </div>

                            <div className="uk-grid uk-grid-collapse uk-width-1-2">
                                <div className="uk-width-expand uk-flex uk-flex-middle">
                                    <input className='uk-input' 
                                        placeholder="e.g. 11.50"
                                        value={this.state.commissionPerMonth}
                                        onChange={(e) => this.handleFormChange("commissionPerMonth", e)}/>
                                </div>
                                <div className="uk-width-auto uk-flex uk-flex-middle">
                                    <p className="uk-margin-small-left">£/month</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="uk-grid">
                        <div className="uk-width-1-2">
                            <div className="uk-margin">
                                <label className='uk-form-label'>Billing Method</label>
                                <select className='uk-select'
                                    value={this.state.billingMethod}
                                    onChange={(e) => this.handleFormChange("billingMethod", e)}>
                                    <option value="" disabled>Select</option>
                                    <option>Paper</option>
                                    <option>Electronic</option>
                                </select>
                            </div>
                        </div>
                        <div className="uk-width-1-2">
                            <div className="uk-margin">
                                <label className='uk-form-label'>Payment Method</label>
                                <select className='uk-select'
                                    value={this.state.paymentMethod}
                                    onChange={(e) => this.handleFormChange("paymentMethod", e)}>
                                    <option value="" disabled>Select</option>
                                    <option>BACS</option>
                                    <option>Direct Debit</option>
                                    <option>Cheque</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </fieldset>        
            </form>
        );
    }
    render() {
        if(this.props.working || this.props.tariffs == null){
            return (<div> <Spinner hasMargin={true}/> </div>);
        }
        return (
            <div>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title"><i className="fas fa-shopping-cart uk-margin-right"></i>Add {this.props.utilityDescription} Tender</h2>
                </div>
                <div className="uk-modal-body">
                    <div>
                        <ul data-uk-switcher="connect: +.uk-switcher" className="uk-tab">
                            <li><a href="#">General</a></li>
                            <li><a href="#">Requirements</a></li>
                        </ul>
                        <ul className='uk-switcher'>
                            {this.renderGeneralEditForm()}
                            {this.renderRequirementsEditForm()}
                        </ul>
                    </div>
                    <div>
                                       
                    </div>
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-right" type="button" onClick={() => this.props.closeModalDialog()}><i className="fas fa-times uk-margin-small-right"></i>Cancel</button>
                    <button className="uk-button uk-button-primary" type="button" onClick={() => this.createTender()}><i className="fas fa-plus-circle uk-margin-small-right"></i>Add</button>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, CreateTenderDialogProps> = (dispatch) => {
    return {
        createTender: (portfolioId, tender, utilityType, isHalfHourly) => dispatch(createTender(portfolioId, tender, utilityType, isHalfHourly)),
        fetchTariffs: () => dispatch(fetchTariffs()),
        closeModalDialog: () => dispatch(closeModalDialog()) 
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, CreateTenderDialogProps, ApplicationState> = (state: ApplicationState) => {
    return {
        working: state.portfolio.tender.update_tender.working || state.portfolio.tender.tariffs.working,
        error: state.portfolio.tender.update_tender.error  ||  state.portfolio.tender.tariffs.error,
        errorMessage: state.portfolio.tender.update_tender.errorMessage  || state.portfolio.tender.tariffs.errorMessage,
        tariffs: state.portfolio.tender.tariffs.value        
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(CreateTenderDialog);