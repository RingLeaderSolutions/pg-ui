import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import ErrorMessage from '../../common/ErrorMessage';
import Spinner from '../../common/Spinner';

import { PortfolioCreationStage } from '../../../model/Models';

import { getAllPortfolios, clearPortfolioCreation } from '../../../actions/portfolioActions';
import CompanySearch from './CompanySearch';
import AccountCreation from './AccountCreation';
import PortfolioCreation from "./PortfolioCreation";

interface StateProps {
    creationStage: PortfolioCreationStage;
}
  
interface DispatchProps {
    refreshPortfolios: () => void;
    completeCreation: () => void;
}

class NewPortfolioDialog extends React.Component<DispatchProps & StateProps, {}> {
    constructor(props:DispatchProps & StateProps){
        super(props);

        this.finishCreation = this.finishCreation.bind(this);
    }

    finishCreation(){
        this.props.completeCreation();
        this.props.refreshPortfolios();
    }

    render(){
        switch(this.props.creationStage){
            case PortfolioCreationStage.CompanySearch:
                return (
                    <div className="uk-modal-dialog">
                        <CompanySearch />
                    </div>);
            case PortfolioCreationStage.AccountCreation:
                return (
                    <div className="uk-modal-dialog">
                        <AccountCreation />
                    </div>);
            case PortfolioCreationStage.PortfolioCreation:
                return (
                <div className="uk-modal-dialog">
                    <PortfolioCreation />
                </div>);
        };

        return (
            <div className="uk-modal-dialog">
                <button className="uk-modal-close-default" type="button" data-uk-close></button>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title">New Prospect</h2>
                </div>
                <div className="uk-modal-body">
                    Your portfolio has been created! Click below to exit this screen.
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-primary uk-modal-close" type="button" onClick={this.finishCreation}>Continue</button>
                </div>
            </div>
        );
        
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => {
    return {
        refreshPortfolios: () => dispatch(getAllPortfolios()),
        completeCreation: () => dispatch(clearPortfolioCreation())
    }
}

const mapStateToProps: MapStateToProps<StateProps, {}> = (state: ApplicationState) => {
    return {
        creationStage: state.portfolios.create.stage.stage,
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(NewPortfolioDialog);