import * as React from "react";
import Header from "../../common/Header";
import ErrorMessage from "../../common/ErrorMessage";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { PortfolioDetails, PortfolioRequirements } from '../../../model/Models';
import Spinner from '../../common/Spinner';
import DatePicker from 'react-datepicker';
import * as moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';

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
    constructor(){
        super();
        // var {requirements} = this.props.details;
        // var contractStart = requirements == null ? moment() : moment(requirements.startDate);
        this.state = {
            contractStart: moment()
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
            portfolioId: details.portfolio.id,

            paymentTerms: Number(this.paymentTerms.value),
            durationMonths: Number(this.contractLength.value),
            greenPercentage: Number(this.greenPercentage.value),

            electricityRequired: this.electricity.checked,
            gasRequired: this.gas.checked,
            product: this.product.value,
            startDate: this.state.contractStart.format("YYYY-MM-DDTHH:mm:ss"),
            // TODO: stodId
            stodId: "day/night"
        };

        this.props.updatePortfolioRequirements(requirements);
    }

    render() {
        if(this.props.error){
            return (<ErrorMessage content={this.props.errorMessage} />);
        }
        if(this.props.working || this.props.details == null){
            return (<Spinner />);
        }
        var { details } = this.props;

        // default values if not yet provided
        var { requirements, portfolio } = details;
        if(requirements == null){
            requirements = {
                portfolioId: portfolio.id,
                durationMonths: 0,
                product: "",
                electricityRequired: true,
                gasRequired: false,
                stodId: "day/night",
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
                                            <option>7</option>
                                            <option>14</option>
                                            <option>21</option>
                                            <option>28</option>
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
                                    <label className="uk-form-label" data-for="contract-length-select">Length</label>
                                    <div className="uk-form-controls">
                                        <select className="uk-select" id="contract-length-select" ref={ref => this.contractLength = ref} 
                                                defaultValue={requirements.durationMonths.toString()}>
                                            <option value="0" disabled>Select length</option>                                            
                                            <option>6</option>
                                            <option>12</option>
                                            <option>18</option>
                                            <option>24</option>
                                            <option>30</option>
                                            <option>36</option>
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
        working: state.portfolio.details.working,
        error: state.portfolio.details.error,
        errorMessage: state.portfolio.details.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(PortfolioRequirementsSection);