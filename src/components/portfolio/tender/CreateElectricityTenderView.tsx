import * as React from "react";
import Header from "../../common/Header";
import ErrorMessage from "../../common/ErrorMessage";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { Portfolio, PortfolioDetails, UtilityType } from '../../../model/Models';
import Spinner from '../../common/Spinner';

import { createHHElectricityTender, createNHHElectricityTender } from '../../../actions/tenderActions';
import { Tender, TenderSupplier } from "../../../model/Tender";

interface CreateElectricityTenderProps {
    portfolioId: string;
    isHalfHourly: boolean;
}

interface StateProps {
    working: boolean;
    error: boolean;
    errorMessage: string;
}

interface DispatchProps {
    createHHTender: (portfolioId: string) => void;
    createNHHTender: (portfolioId: string) => void;
}

class CreateElectricityTenderView extends React.Component<CreateElectricityTenderProps & StateProps & DispatchProps, {}> {
    constructor() {
        super();
    }

    createElectricityTender(){
        if(this.props.isHalfHourly){
            this.props.createHHTender(this.props.portfolioId);
        }
        else {
            this.props.createNHHTender(this.props.portfolioId);
        }
    }
    
    renderCard(content: any){
        return (
            <div className="uk-card uk-card-default uk-card-body">
                {content}
            </div>);
    }
    
    render() {
        if(this.props.error){
            var error = (<ErrorMessage content={this.props.errorMessage} />);
            return this.renderCard(error);
        }
        if(this.props.working){
            var spinner = (<Spinner hasMargin={true}/>);
            return this.renderCard(spinner);
        }

        var buttonContent = this.props.isHalfHourly ? "Create a half-hourly electricity tender" : "Create a non-half-hourly electricity tender";
        var content = (
            <div className="uk-grid uk-flex-center" data-uk-grid>
                <button className="uk-button uk-button-primary" type="button" onClick={() => this.createElectricityTender()}>
                    <span className="uk-margin-small-right" data-uk-icon="icon: bolt" />
                    {buttonContent}
                </button>
            </div>)
        return this.renderCard(content);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, CreateElectricityTenderProps> = (dispatch) => {
    return {
        createHHTender: (portfolioId) => dispatch(createHHElectricityTender(portfolioId)),
        createNHHTender: (portfolioId) => dispatch(createNHHElectricityTender(portfolioId))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, CreateElectricityTenderProps> = (state: ApplicationState) => {
    return {
        working: state.portfolio.tender.create_nhh_electricity_tender.working || state.portfolio.tender.create_hh_electricity_tender.working,
        error: state.portfolio.tender.create_nhh_electricity_tender.error || state.portfolio.tender.create_hh_electricity_tender.error,
        errorMessage: state.portfolio.tender.create_nhh_electricity_tender.errorMessage || state.portfolio.tender.create_hh_electricity_tender.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(CreateElectricityTenderView);