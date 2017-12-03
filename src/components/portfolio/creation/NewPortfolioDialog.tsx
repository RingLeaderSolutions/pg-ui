import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import ErrorMessage from '../../common/ErrorMessage';
import Spinner from '../../common/Spinner';

import { PortfolioCreationStage } from '../../../model/Models';

import { getAllPortfolios } from '../../../actions/portfolioActions';
import CompanySearch from './CompanySearch';
import AccountCreation from './AccountCreation';
import PortfolioCreation from "./PortfolioCreation";

interface StateProps {
    creationStage: PortfolioCreationStage;
}
  
interface DispatchProps {
    refreshPortfolios: () => void;
}

class NewPortfolioDialog extends React.Component<DispatchProps & StateProps, {}> {
    finishCreation(){
        this.props.refreshPortfolios();
    }

    render(){
        switch(this.props.creationStage){
            case PortfolioCreationStage.CompanySearch:
                return (<CompanySearch />);
            case PortfolioCreationStage.AccountCreation:
                return (<AccountCreation />);
            case PortfolioCreationStage.PortfolioCreation:
                return (<PortfolioCreation />);
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
                <button className="uk-button uk-button-primary" type="button" onClick={this.finishCreation}>Continue</button>
            </div>
            </div>
        );
        
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => {
    return {
        refreshPortfolios: () => dispatch(getAllPortfolios())
    }
}

const mapStateToProps: MapStateToProps<StateProps, {}> = (state: ApplicationState) => {
    return {
        creationStage: state.portfolios.create.stage.stage,
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(NewPortfolioDialog);