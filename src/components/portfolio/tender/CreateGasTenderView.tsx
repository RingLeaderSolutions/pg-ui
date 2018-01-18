import * as React from "react";
import Header from "../../common/Header";
import ErrorMessage from "../../common/ErrorMessage";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { Portfolio, PortfolioDetails, UtilityType } from '../../../model/Models';
import Spinner from '../../common/Spinner';

import { createGasTender } from '../../../actions/tenderActions';
import { Tender, TenderSupplier } from "../../../model/Tender";

interface CreateGasTenderProps {
    portfolioId: string;
}

interface StateProps {
    working: boolean;
    error: boolean;
    errorMessage: string;
}

interface DispatchProps {
    createTender: (portfolioId: string) => void;
}

class CreateGasTenderView extends React.Component<CreateGasTenderProps & StateProps & DispatchProps, {}> {
    constructor() {
        super();
    }

    createGasTender(){
        this.props.createTender(this.props.portfolioId);
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

        var content = (
            <div className="uk-grid uk-flex-center" data-uk-grid>
                <button className="uk-button uk-button-primary" type="button" onClick={() => this.createGasTender()}>
                    <span className="uk-margin-small-right" data-uk-icon="icon: world" />
                    Create a gas tender
                </button>
            </div>)
        return this.renderCard(content);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, CreateGasTenderProps> = (dispatch) => {
    return {
        createTender: (portfolioId) => dispatch(createGasTender(portfolioId))        
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, CreateGasTenderProps> = (state: ApplicationState) => {
    return {
        working: state.portfolio.tender.create_gas_tender.working,
        error: state.portfolio.tender.create_gas_tender.error,
        errorMessage: state.portfolio.tender.create_gas_tender.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(CreateGasTenderView);