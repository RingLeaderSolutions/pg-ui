import * as React from "react";
import Header from "../../common/Header";
import ErrorMessage from "../../common/ErrorMessage";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { Portfolio, PortfolioDetails } from '../../../model/Models';
import Spinner from '../../common/Spinner';

import { getPortfolioDetails } from '../../../actions/portfolioActions';
import PortfolioRequirementsSection from "./PortfolioRequirementsSection";

interface PortfolioSetupProps {
    portfolio: Portfolio;
}

interface StateProps {
  details: PortfolioDetails;
  working: boolean;
  error: boolean;
  errorMessage: string;
}

interface DispatchProps {
    getPortfolioDetails: (portfolioId: string) => void;
}

class PortfolioSetup extends React.Component<PortfolioSetupProps & StateProps & DispatchProps, {}> {
    constructor() {
        super();
    }

    componentDidMount(){
        let portfolioId = this.props.portfolio.id;     
        this.props.getPortfolioDetails(portfolioId);
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
            <div className="content-inner-portfolio">
                <h1> {details.portfolio.title}</h1>
                <PortfolioRequirementsSection details={details} />
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, PortfolioSetupProps> = (dispatch) => {
    return {
        getPortfolioDetails: (portfolioId: string) => dispatch(getPortfolioDetails(portfolioId))        
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, PortfolioSetupProps> = (state: ApplicationState) => {
    return {
        details: state.portfolio.details.value,
        working: state.portfolio.details.working,
        error: state.portfolio.details.error,
        errorMessage: state.portfolio.details.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(PortfolioSetup);