import * as React from "react";
import Header from "../../common/Header";
import ErrorMessage from "../../common/ErrorMessage";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { PortfolioDetails, PortfolioRequirements } from '../../../model/Models';
import Spinner from '../../common/Spinner';
import DatePicker from 'react-datepicker';
import * as moment from 'moment';

import { updatePortfolioRequirements } from '../../../actions/portfolioActions';

interface PortfolioRequirementsSectionProps {
    details: PortfolioDetails;
}

interface StateProps {
  working: boolean;
  error: boolean;
  errorMessage: string;
}

interface DispatchProps {
    updatePortfolioRequirements: (requirements: PortfolioRequirements) => void;
}

interface PortfolioRequirementsState {
    contractStart: moment.Moment;
}

class PortfolioRequirementsSection extends React.Component<PortfolioRequirementsSectionProps & StateProps & DispatchProps, PortfolioRequirementsState> {
    constructor(props: PortfolioRequirementsSectionProps & StateProps & DispatchProps){
        super();
        var { requirements } = props.details;
        this.state = {
            contractStart: requirements ? requirements.startDate ? moment(requirements.startDate) : moment() : moment() 
        }
        this.saveRequirements = this.saveRequirements.bind(this);
        this.handleContractStartChange = this.handleContractStartChange.bind(this);
    }

    paymentTerms: HTMLSelectElement;
    product: HTMLSelectElement;
    contractLength: HTMLSelectElement;
    greenPercentage: HTMLInputElement;
    gas: HTMLInputElement;
    electricity: HTMLInputElement;

    handleContractStartChange(date: moment.Moment){
        this.setState({
            contractStart: date
        });
    }

    saveRequirements(){
        let { details } = this.props;
        let requirements: PortfolioRequirements = {
            entityId: details.portfolio.id,

            paymentTerms: Number(this.paymentTerms.value),
            durationMonths: Number(this.contractLength.value),
            greenPercentage: Number(this.greenPercentage.value),

            electricityRequired: this.electricity.checked,
            gasRequired: this.gas.checked,
            product: this.product.value,
            startDate: this.state.contractStart.format("YYYY-MM-DDTHH:mm:ss"),
            // TODO: stodId
            tariffId: "day/night"
        };

        this.props.updatePortfolioRequirements(requirements);
    }

    render() {
        if(this.props.error){
            return (<div className="uk-card uk-card-default uk-card-body"><ErrorMessage content={this.props.errorMessage} /></div>);
        }
        if(this.props.working || this.props.details == null){
            return (<div className="uk-card uk-card-default uk-card-body"><Spinner hasMargin={true}/></div>);
        }
        var { details } = this.props;

        // default values if not yet provided
        var { requirements, portfolio } = details;
        if(requirements == null){
            requirements = {
                entityId: portfolio.id,
                durationMonths: 0,
                product: "",
                electricityRequired: true,
                gasRequired: false,
                tariffId: "day/night",
                paymentTerms: 0,
                greenPercentage: 0,
                startDate: this.state.contractStart.unix().toString()
            }
        }
        return (
            <div className="uk-card uk-card-default uk-card-body">
                <form>
                    <fieldset className="uk-fieldset">
                        <h3>Portfolio Requirements</h3>
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
                                                    selected={this.state.contractStart}
                                                    onChange={this.handleContractStartChange}/>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="uk-margin">
                                    <label><input className="uk-checkbox" type="checkbox" ref={ref => this.electricity = ref} defaultChecked={requirements.electricityRequired}/> Electricity</label>
                                </div>

                                <div className="uk-margin">
                                    <label><input className="uk-checkbox" type="checkbox" ref={ref => this.gas = ref} defaultChecked={requirements.gasRequired}/> Gas</label>
                                </div>

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
                            </div>
                        </div>
                        <div className="uk-margin-small uk-float-right">
                            <button className="uk-button uk-button-primary" type="button" onClick={this.saveRequirements}>
                                <span className="uk-margin-small-right" data-uk-icon="icon: cog" />
                                Update
                            </button>
                        </div>
                    </fieldset>
                </form>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, PortfolioRequirementsSectionProps> = (dispatch) => {
    return {
        updatePortfolioRequirements: (requirements: PortfolioRequirements) => dispatch(updatePortfolioRequirements(requirements))        
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, PortfolioRequirementsSectionProps> = (state: ApplicationState) => {
    return {
        working: state.portfolio.details.working || state.portfolio.update_requirements.working,
        error: state.portfolio.update_requirements.error,
        errorMessage: state.portfolio.update_requirements.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(PortfolioRequirementsSection);