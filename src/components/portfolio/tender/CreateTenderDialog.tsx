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
import { closeModalDialog } from "../../../actions/viewActions";


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
    product: string;
    contractLength: string;
    tariff: string;
    greenPercentage: string;
}

class CreateTenderDialog extends React.Component<CreateTenderDialogProps & StateProps & DispatchProps, CreateTenderState> {
    constructor(props: CreateTenderDialogProps & StateProps & DispatchProps){
        super();
        this.state = {
            deadline: moment(),
            title: '',
            commission:'',
            billingMethod: '',
            deadlineNotes: '',
            ebInclusive: true,
            paymentTerms: '',
            product: '',
            tariff: '',
            contractLength: '',
            greenPercentage: ''
        };
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

    handleDeadlineChange(date: moment.Moment, event: React.SyntheticEvent<any>){
        this.setState({
            deadline: date
        });

        event.preventDefault();
    }

    handleInclusiveChange(flip: boolean, e: React.ChangeEvent<HTMLInputElement>){
        var value = flip ? !e.target.checked : e.target.checked;
        this.setState({
            ...this.state,
            ebInclusive: value
        });
    }

    createTender(){
        let requirements: TenderRequirements = {
            id: "",
            portfolioId: this.props.portfolioId,
            tenderId: "",

            paymentTerms: Number(this.state.paymentTerms),
            durationMonths: Number(this.state.contractLength),
            greenPercentage: Number(this.state.greenPercentage),

            product: this.state.product,
            tariffId: this.state.tariff ? this.state.tariff : null
        };

        var tender: Tender = {
            portfolioId: this.props.portfolioId,
            utility: this.props.utility == UtilityType.Electricity ? "ELECTRICITY" : "GAS",

            tenderTitle: this.state.title,
            billingMethod: this.state.billingMethod,
            deadline: this.state.deadline.format("YYYY-MM-DDTHH:mm:ss"),
            deadlineNotes: this.state.deadlineNotes,
            commission: Number(this.state.commission),
            halfHourly: this.props.isHalfHourly,
            allInclusive: this.state.ebInclusive,
            requirements
        }

        this.props.createTender(this.props.portfolioId, tender, this.props.utility, this.props.isHalfHourly);
        this.props.closeModalDialog();
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

                                    <div className="uk-margin">
                                        <label className="uk-form-label" data-for="product-select">Product</label>
                                        <div className="uk-form-controls">
                                            <select className="uk-select" id="product-select" 
                                                value={this.state.product}
                                                onChange={(e) => this.handleFormChange("product", e)}>
                                                <option value="" disabled>Select product</option>
                                                <option>Fixed</option>
                                                <option>Semi Flex</option>
                                                <option>Flex</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="uk-margin">
                                        <label className="uk-form-label" data-for="green-perc-input">Green %</label>
                                        <div className="uk-form-controls">
                                            <input className="uk-input" id="green-perc-input" type="text" placeholder="20" 
                                                value={this.state.greenPercentage}
                                                onChange={(e) => this.handleFormChange("greenPercentage", e)}/>
                                        </div>
                                    </div>

                                    <div className="uk-margin">
                                        <label className="uk-form-label" data-for="contract-length-select">Contract Length</label>
                                        <div className="uk-form-controls">
                                            <select className="uk-select" id="contract-length-select"
                                                value={this.state.contractLength}
                                                onChange={(e) => this.handleFormChange("contractLength", e)}>
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
                                            <select className="uk-select" id="tariff-select"
                                                value={this.state.tariff}
                                                onChange={(e) => this.handleFormChange("tariff", e)}>
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
                                    value={this.state.title}
                                    onChange={(e) => this.handleFormChange("title", e)}/>
                            </div>

                            <div className='uk-margin'>
                                <label className='uk-form-label'>Commission</label>
                                <div className="uk-grid" data-uk-grid>
                                    <div className="uk-width-expand@s">
                                        <input className='uk-input' 
                                            value={this.state.commission}
                                            onChange={(e) => this.handleFormChange("commission", e)}/>
                                    </div>
                                    <div className="uk-width-auto@s">
                                        <p className="uk-margin-small-top">p/kWh</p>
                                    </div>
                                </div>
                            </div>

                            <div className='uk-margin'>
                                <label className='uk-form-label'>Billing Method</label>
                                <select className='uk-select'
                                    value={this.state.billingMethod}
                                    onChange={(e) => this.handleFormChange("billingMethod", e)}>
                                    <option value="" disabled>Select</option>
                                    <option>Paper</option>
                                    <option>Electronic</option>
                                </select>
                            </div>

                            { !isGas ? (
                                <div className='uk-margin'>
                                    <label className='uk-form-label'>Embedded Benefits</label>
                                    <div className="uk-margin-small">
                                        <label><input className="uk-radio" type="radio" name="ebChoice" checked={this.state.ebInclusive} onChange={(e) => this.handleInclusiveChange(false, e)}/> Inclusive</label>
                                        <label><input className="uk-radio uk-margin-large-left" type="radio" name="ebChoice" checked={!this.state.ebInclusive} onChange={(e) => this.handleInclusiveChange(true, e)} /> Pass-Through</label>
                                    </div>
                                </div>)
                            : null}

                            <div className="uk-margin">
                                <label className="uk-form-label" data-for="deadline-input">Deadline</label>
                                <div className="uk-form-controls">
                                    <DatePicker id="deadline-input"
                                                className="uk-input"
                                                selected={this.state.deadline}
                                                onChange={(date, ev) => this.handleDeadlineChange(date, ev)}/>
                                </div>
                            </div>

                            <div className='uk-margin'>
                                <label className='uk-form-label'>Deadline notes</label>
                                <textarea className='uk-textarea' 
                                    rows={4}
                                    value={this.state.deadlineNotes}
                                    onChange={(e) => this.handleFormChange("deadlineNotes", e)}/>
                            </div>
                        </fieldset>        
                    </div>
                </div>
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
                    <button className="uk-button uk-button-default uk-margin-right" type="button" onClick={() => this.props.closeModalDialog()}>Cancel</button>
                    <button className="uk-button uk-button-primary" type="button" onClick={() => this.createTender()}>Save</button>
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
  
const mapStateToProps: MapStateToProps<StateProps, CreateTenderDialogProps> = (state: ApplicationState) => {
    return {
        working: state.portfolio.tender.update_tender.working || state.portfolio.tender.tariffs.working,
        error: state.portfolio.tender.update_tender.error  ||  state.portfolio.tender.tariffs.error,
        errorMessage: state.portfolio.tender.update_tender.errorMessage  || state.portfolio.tender.tariffs.errorMessage,
        tariffs: state.portfolio.tender.tariffs.value        
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(CreateTenderDialog);