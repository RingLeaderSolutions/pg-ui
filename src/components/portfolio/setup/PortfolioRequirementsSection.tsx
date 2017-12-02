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

//import { updatePortfolioRequirements } from '../../../actions/portfolioActions';

interface PortfolioRequirementsSectionProps {
    details: PortfolioDetails;
}

interface StateProps {
  working: boolean;
  error: boolean;
  errorMessage: string;
}

interface DispatchProps {
    //updatePortfolioRequirements: (requirements: PortfolioRequirements) => void;
}

interface PortfolioRequirementsState {
    contractStart: moment.Moment;
}

class PortfolioRequirementsSection extends React.Component<PortfolioRequirementsSectionProps & StateProps & DispatchProps, PortfolioRequirementsState> {
    constructor(){
        super();
        this.state = {
            contractStart: moment()
        }
        this.saveRequirements = this.saveRequirements.bind(this);
        this.handleContractStartChange = this.handleContractStartChange.bind(this);
    }
    handleContractStartChange(date: moment.Moment){
        this.setState({
            contractStart: date
        })
    }
    saveRequirements(){
        //this.updatePortfolioRequirements();
    }
    render() {
        if(this.props.error){
            return (<ErrorMessage content={this.props.errorMessage} />);
        }
        if(this.props.working || this.props.details == null){
            return (<Spinner />);
        }
        var { details } = this.props;
        return (
            <div className="uk-card uk-card-default uk-card-body">
                <form>
                    <fieldset className="uk-fieldset">
                        <h3>Portfolio Requirements</h3>
                        <div className="uk-grid uk-child-width-expand" data-uk-grid>
                            <div className="">
                                <div className="uk-margin">
                                    <label className="uk-form-label" data-for="payment-terms-select">Payment Terms</label>
                                    <div className="uk-form-controls">
                                        <select className="uk-select" id="payment-terms-select">
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
                                        <select className="uk-select" id="product-select">
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
                                                    onChange={this.handleContractStartChange} />
                                    </div>
                                </div>
                            </div>

                            <div className="">
                                <div className="uk-margin">
                                    <label><input className="uk-checkbox" type="checkbox" checked /> Electricity</label>
                                </div>

                                <div className="uk-margin">
                                    <label><input className="uk-checkbox" type="checkbox" /> Gas</label>
                                </div>

                                <div className="uk-margin">
                                    <label className="uk-form-label" data-for="green-perc-input">Green %</label>
                                    <div className="uk-form-controls">
                                        <input className="uk-input" id="green-perc-input" type="text" placeholder="20" />
                                    </div>
                                </div>

                                <div className="uk-margin">
                                    <label className="uk-form-label" data-for="contract-length-select">Length</label>
                                    <div className="uk-form-controls">
                                        <select className="uk-select" id="contract-length-select">
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
                            <button className="uk-button uk-button-primary" type="button" onClick={this.saveRequirements} disabled>
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
        //updatePortfolioRequirements: (requirements: PortfolioRequirements) => dispatch(updatePortfolioRequirements(requirements))        
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