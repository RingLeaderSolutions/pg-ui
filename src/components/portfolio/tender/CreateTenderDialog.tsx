import * as React from "react";
import { UtilityType } from '../../../model/Models';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import Spinner from '../../common/Spinner';
import * as moment from 'moment';
import DatePicker from 'react-datepicker';

import { fetchTariffs } from '../../../actions/portfolioActions';
import { createTender } from '../../../actions/tenderActions';
import { Tender, TenderRequirements, Tariff } from "../../../model/Tender";


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
}

interface CreateTenderState {
    deadline: moment.Moment;
    endDate: moment.Moment;    
}

class CreateTenderDialog extends React.Component<CreateTenderDialogProps & StateProps & DispatchProps, CreateTenderState> {
    constructor(props: CreateTenderDialogProps & StateProps & DispatchProps){
        super();
        this.state = {
            deadline: moment(),
            endDate:  moment()             
        };

        this.handleDeadlineChange = this.handleDeadlineChange.bind(this);
        this.handleendDateChange = this.handleendDateChange.bind(this);
        this.createTender = this.createTender.bind(this);
    }
    // Standard
    titleElement: HTMLInputElement;
    commissionElement: HTMLInputElement;
    billingMethodElement: HTMLSelectElement;
    deadlineNotesElement: HTMLTextAreaElement;
    isHalfHourlyElement: HTMLInputElement;
    ebInclusiveElement: HTMLInputElement;

    // Requirements
    paymentTerms: HTMLSelectElement;
    product: HTMLSelectElement;
    contractLength: HTMLSelectElement;
    tariff: HTMLSelectElement;
    greenPercentage: HTMLInputElement;

    componentDidMount(){
        this.props.fetchTariffs();
    }

    handleendDateChange(date: moment.Moment, event: React.SyntheticEvent<any>){
        this.setState({
            endDate: date
        });

        event.preventDefault();
    }

    handleDeadlineChange(date: moment.Moment, event: React.SyntheticEvent<any>){
        this.setState({
            deadline: date
        });

        event.preventDefault();
    }

    createTender(e: any){
        let requirements: TenderRequirements = {
            id: "",
            portfolioId: this.props.portfolioId,
            tenderId: "",

            paymentTerms: Number(this.paymentTerms.value),
            durationMonths: Number(this.contractLength.value),
            greenPercentage: Number(this.greenPercentage.value),

            product: this.product.value,
            endDate: this.state.endDate.format("YYYY-MM-DDTHH:mm:ss"),
            tariffId: this.tariff ? this.tariff.value : null
        };

        var tender: Tender = {
            portfolioId: this.props.portfolioId,
            utility: this.props.utility == UtilityType.Electricity ? "ELECTRICITY" : "GAS",
            tenderTitle: this.titleElement.value,
            billingMethod: this.billingMethodElement.value,
            deadline: this.state.deadline.format("YYYY-MM-DDTHH:mm:ss"),
            deadlineNotes: this.deadlineNotesElement.value,
            commission: Number(this.commissionElement.value),
            halfHourly: this.props.isHalfHourly,
            allInclusive: this.ebInclusiveElement ? this.ebInclusiveElement.checked : false,
            requirements
        }

        this.props.createTender(this.props.portfolioId, tender, this.props.utility, this.props.isHalfHourly);
    }

    renderTariffOptions(){
        return this.props.tariffs.map(t => {
            return (<option key={t.id} value={t.id}>{t.name}</option>)
        });
    }

    renderRequirementsEditForm(){
        var isGasTender = this.props.utility == UtilityType.Gas;
        var isHalfhourly = this.props.isHalfHourly;
        return (
            <form>
                <div className='uk-flex'>
                    <div className='uk-card uk-card-default uk-card-small uk-card-body uk-flex-1'>
                        <fieldset className='uk-fieldset'>
                            <div className="uk-grid uk-child-width-expand" data-uk-grid>
                                <div>
                                    <div className="uk-margin">
                                        <label className="uk-form-label" data-for="payment-terms-select">Payment Terms</label>
                                        <div className="uk-form-controls">
                                            <select className="uk-select" id="payment-terms-select" ref={ref => this.paymentTerms = ref}>
                                                <option value="0" disabled>Select terms</option>
                                                <option value={7}>7 days</option>
                                                <option value={14}>14 days</option>
                                                <option value={21}>21 days</option>
                                                <option value={28}>28 days</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="uk-margin">
                                        <label className="uk-form-label" data-for="product-select">Product</label>
                                        <div className="uk-form-controls">
                                            <select className="uk-select" id="product-select" ref={ref => this.product = ref}>
                                                <option value="" disabled>Select product</option>
                                                <option>Fixed</option>
                                                <option>Semi Flex</option>
                                                <option>Flex</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="uk-margin">
                                        <label className="uk-form-label" data-for="contract-start-input">Contract End</label>
                                        <div className="uk-form-controls">
                                            <DatePicker id="contract-start-input"
                                                        className="uk-input"
                                                        selected={this.state.endDate}
                                                        onChange={this.handleendDateChange}/>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="uk-margin">
                                        <label className="uk-form-label" data-for="green-perc-input">Green %</label>
                                        <div className="uk-form-controls">
                                            <input className="uk-input" id="green-perc-input" type="text" placeholder="20" ref={ref => this.greenPercentage = ref} defaultValue="0"/>
                                        </div>
                                    </div>

                                    <div className="uk-margin">
                                        <label className="uk-form-label" data-for="contract-length-select">Contract Length</label>
                                        <div className="uk-form-controls">
                                            <select className="uk-select" id="contract-length-select" ref={ref => this.contractLength = ref}>
                                                <option value="0" disabled>Select length</option>                                            
                                                <option value={6}>6 months</option>
                                                <option value={12}>12 months</option>
                                                <option value={18}>18 months</option>
                                                <option value={24}>24 months</option>
                                                <option value={30}>30 months</option>
                                                <option value={36}>36 months</option>
                                            </select>
                                        </div>
                                    </div>

                                    { !isGasTender && isHalfhourly ? (
                                    <div className="uk-margin">
                                        <label className="uk-form-label" data-for="tariff-select">Tariff</label>
                                        <div className="uk-form-controls">
                                            <select className="uk-select" id="tariff-select" ref={ref => this.tariff = ref} >
                                                <option value="" disabled>Select tariff</option>                                            
                                                {this.renderTariffOptions()}
                                            </select>
                                        </div>
                                    </div>) : null}
                                </div>
                            </div>
                        </fieldset>
                        
                    </div>
                </div>
            </form>
        );
    }

    renderGeneralEditForm(){ 
        var isGas = this.props.utility == UtilityType.Gas;    
        return (
            <form>
                <div className='uk-flex'>
                    <div className='uk-card uk-card-small uk-card-default uk-card-body uk-flex-1'>
                        <fieldset className='uk-fieldset'>
                            <div className='uk-margin'>
                                <label className='uk-form-label'>Title</label>
                                <input className='uk-input' 
                                    ref={ref => this.titleElement = ref}/>
                            </div>

                            <div className='uk-margin'>
                                <label className='uk-form-label'>Commission</label>
                                <div className="uk-grid" data-uk-grid>
                                    <div className="uk-width-expand@s">
                                        <input className='uk-input' 
                                            ref={ref => this.commissionElement = ref}/>
                                    </div>
                                    <div className="uk-width-auto@s">
                                        <p className="uk-margin-small-top">p/kWh</p>
                                    </div>
                                </div>
                            </div>

                            <div className='uk-margin'>
                                <label className='uk-form-label'>Billing Method</label>
                                <select className='uk-select' 
                                    ref={ref => this.billingMethodElement = ref}>
                                    <option value="" disabled>Select</option>
                                    <option>Paper</option>
                                    <option>Electronic</option>
                                </select>
                            </div>

                            { !isGas ? (
                                <div className='uk-margin'>
                                    <label className='uk-form-label'>Embedded Benefits</label>
                                    <div className="uk-margin-small">
                                        <label><input className="uk-radio" type="radio" name="ebChoice" ref={ref => this.ebInclusiveElement = ref} defaultChecked={true} /> Inclusive</label>
                                        <label><input className="uk-radio uk-margin-large-left" type="radio" name="ebChoice"  /> Pass-Through</label>
                                    </div>
                                </div>)
                            : null}

                            <div className="uk-margin">
                                <label className="uk-form-label" data-for="deadline-input">Deadline</label>
                                <div className="uk-form-controls">
                                    <DatePicker id="deadline-input"
                                                className="uk-input"
                                                selected={this.state.deadline}
                                                onChange={this.handleDeadlineChange}/>
                                </div>
                            </div>

                            <div className='uk-margin'>
                                <label className='uk-form-label'>Deadline notes</label>
                                <textarea className='uk-textarea' 
                                    rows={4}
                                    ref={ref => this.deadlineNotesElement = ref}/>
                            </div>
                        </fieldset>        
                    </div>
                </div>
            </form>
        );
    }
    render() {
        if(this.props.working || this.props.tariffs == null){
            var spinner = (<Spinner hasMargin={true}/>);
            return (<div className="uk-modal-dialog"> <Spinner /> </div>);
        }
        return (
            <div className="uk-modal-dialog">
                <button className="uk-modal-close-default" type="button" data-uk-close></button>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title">Create {this.props.utilityDescription} Tender</h2>
                </div>
                <div className="uk-modal-body">
                    <div>
                    <ul data-uk-tab className="uk-tab">
                        <li><a href="#">General</a></li>
                        <li><a href="#">Requirements</a></li>
                    </ul>
                    <ul className='uk-switcher'>
                        <li>{this.renderGeneralEditForm()}</li>
                        <li>{this.renderRequirementsEditForm()}</li>
                    </ul>
                    </div>
                    <div>
                                       
                    </div>
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-right uk-modal-close" type="button">Cancel</button>
                    <button className="uk-button uk-button-primary uk-modal-close" type="button" onClick={(e) => this.createTender(e)}>Save</button>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, CreateTenderDialogProps> = (dispatch) => {
    return {
        createTender: (portfolioId, tender, utilityType, isHalfHourly) => dispatch(createTender(portfolioId, tender, utilityType, isHalfHourly)),
        fetchTariffs: () => dispatch(fetchTariffs())
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, CreateTenderDialogProps> = (state: ApplicationState) => {
    return {
        working: state.portfolio.tender.update_tender.working || state.portfolio.tender.tariffs.working,
        error: state.portfolio.tender.update_tender.error  ||  state.portfolio.tender.tariffs.error,
        errorMessage: state.portfolio.tender.update_tender.errorMessage  || state.portfolio.tender.tariffs.errorMessage,
        tariffs: state.portfolio.tender.tariffs.value        
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(CreateTenderDialog);