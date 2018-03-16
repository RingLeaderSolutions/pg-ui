import * as React from "react";
import { Portfolio, PortfolioDetails, UtilityType } from '../../../model/Models';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import Spinner from '../../common/Spinner';
import ErrorMessage from "../../common/ErrorMessage";
import * as moment from 'moment';
import DatePicker from 'react-datepicker';

import { fetchTariffs } from '../../../actions/portfolioActions';
import { updateTenderRequirements } from '../../../actions/tenderActions';
import { Tender, TenderRequirements, Tariff } from "../../../model/Tender";

interface UpdateTenderRequirementsDialogProps {
    tender: Tender;
}

interface StateProps {
    working: boolean;
    error: boolean;
    errorMessage: string;
    tariffs: Tariff[];
}
  
interface DispatchProps {
    updateTenderRequirements: (requirements: TenderRequirements) => void;
    fetchTariffs: () => void;
}

interface UpdateTenderRequirementsState {
    startDate: moment.Moment;
}

class UpdateTenderRequirementsDialog extends React.Component<UpdateTenderRequirementsDialogProps & StateProps & DispatchProps, UpdateTenderRequirementsState> {
    constructor(props: UpdateTenderRequirementsDialogProps & StateProps & DispatchProps){
        super();
        var { requirements } = props.tender;
        this.state = {
            startDate: requirements ? requirements.startDate ? moment(requirements.startDate) : moment() : moment() 
        };

        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.saveRequirements = this.saveRequirements.bind(this);
    }
    paymentTerms: HTMLSelectElement;
    product: HTMLSelectElement;
    contractLength: HTMLSelectElement;
    tariff: HTMLSelectElement;
    greenPercentage: HTMLInputElement;

    componentDidMount(){
        this.props.fetchTariffs();
    }

    handleStartDateChange(date: moment.Moment, event: React.SyntheticEvent<any>){
        this.setState({
            startDate: date
        });

        event.preventDefault();
    }

    saveRequirements(){
        let { tender } = this.props;
        let requirements: TenderRequirements = {
            id: "",
            portfolioId: tender.portfolioId,
            tenderId: tender.tenderId,

            paymentTerms: Number(this.paymentTerms.value),
            durationMonths: Number(this.contractLength.value),
            greenPercentage: Number(this.greenPercentage.value),

            product: this.product.value,
            startDate: this.state.startDate.format("YYYY-MM-DDTHH:mm:ss"),
            tariffId: this.tariff.value
        };

        this.props.updateTenderRequirements(requirements);
    }

    renderTariffOptions(){
        return this.props.tariffs.map(t => {
            return (<option key={t.id} value={t.id}>{t.name}</option>)
        });
    }

    render() {
        if(this.props.working || this.props.tariffs == null){
            var spinner = (<Spinner hasMargin={true}/>);
            return (<div className="uk-modal-dialog"> <Spinner /> </div>);
        }
        let { tender } = this.props;
        var { requirements } = tender;
        if(requirements == null){
            requirements = {
                id: "",
                tenderId: tender.tenderId,
                portfolioId: tender.portfolioId,
                durationMonths: 0,
                product: "",
                tariffId: "",
                paymentTerms: 0,
                greenPercentage: 0,
                startDate: this.state.startDate.unix().toString()
            }
        }
        return (
            <div className="uk-modal-dialog">
                <button className="uk-modal-close-default" type="button" data-uk-close></button>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title">Update Tender Requirements</h2>
                </div>
                <div className="uk-modal-body">
                    <form>
                        <div className='uk-flex'>
                            <div className='uk-card uk-card-default uk-card-body uk-flex-1'>
                                <fieldset className='uk-fieldset'>
                                    <div className="uk-grid uk-child-width-expand" data-uk-grid>
                                        <div>
                                            <div className="uk-margin">
                                                <label className="uk-form-label" data-for="payment-terms-select">Payment Terms</label>
                                                <div className="uk-form-controls">
                                                    <select className="uk-select" id="payment-terms-select" ref={ref => this.paymentTerms = ref} 
                                                            defaultValue={requirements.paymentTerms.toString()}>
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
                                                    <select className="uk-select" id="product-select" ref={ref => this.product = ref}
                                                            defaultValue={requirements.product.toString()}>
                                                        <option value="" disabled>Select product</option>
                                                        <option>Fixed</option>
                                                        <option>Semi Flex</option>
                                                        <option>Flex</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="uk-margin">
                                                <label className="uk-form-label" data-for="contract-start-input">Contract Start</label>
                                                <div className="uk-form-controls">
                                                    <DatePicker id="contract-start-input"
                                                                className="uk-input"
                                                                selected={this.state.startDate}
                                                                onChange={this.handleStartDateChange}/>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="uk-margin">
                                                <label className="uk-form-label" data-for="green-perc-input">Green %</label>
                                                <div className="uk-form-controls">
                                                    <input className="uk-input" id="green-perc-input" type="text" placeholder="20" ref={ref => this.greenPercentage = ref} defaultValue={requirements.greenPercentage.toString()}/>
                                                </div>
                                            </div>

                                            <div className="uk-margin">
                                                <label className="uk-form-label" data-for="contract-length-select">Contract Length</label>
                                                <div className="uk-form-controls">
                                                    <select className="uk-select" id="contract-length-select" ref={ref => this.contractLength = ref} 
                                                            defaultValue={requirements.durationMonths.toString()}>
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

                                            <div className="uk-margin">
                                                <label className="uk-form-label" data-for="tariff-select">Tariff</label>
                                                <div className="uk-form-controls">
                                                    <select className="uk-select" id="tariff-select" ref={ref => this.tariff = ref} 
                                                            defaultValue={requirements.tariffId.toString()}>
                                                        <option value="" disabled>Select tariff</option>                                            
                                                        {this.renderTariffOptions()}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                        
                    </form>
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-right uk-modal-close" type="button">Cancel</button>
                    <button className="uk-button uk-button-primary uk-modal-close" type="button" onClick={() => this.saveRequirements()}>Update</button>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, UpdateTenderRequirementsDialogProps> = (dispatch) => {
    return {
        updateTenderRequirements: (requirements) => dispatch(updateTenderRequirements(requirements)),
        fetchTariffs: () => dispatch(fetchTariffs())
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, UpdateTenderRequirementsDialogProps> = (state: ApplicationState) => {
    return {
        working: state.portfolio.tender.update_requirements.working || state.portfolio.tender.tariffs.working,
        error: state.portfolio.tender.update_requirements.error ||  state.portfolio.tender.tariffs.error,
        errorMessage: state.portfolio.tender.update_requirements.errorMessage || state.portfolio.tender.tariffs.errorMessage,
        tariffs: state.portfolio.tender.tariffs.value
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(UpdateTenderRequirementsDialog);