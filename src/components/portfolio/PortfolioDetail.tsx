import * as React from "react";
import Header from "../common/Header";
import ErrorMessage from "../common/ErrorMessage";
import { RouteComponentProps } from 'react-router';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../applicationState';
import { Portfolio } from '../../model/Models';
import Spinner from '../common/Spinner';

import PortfolioSetup from "./setup/PortfolioSetup";
import PortfolioSummary from "./summary/PortfolioSummary";
import PortfolioUploads from "./upload/PortfolioUploads";
import PortfolioMeters from "./mpan/PortfolioMeters";

import { getSinglePortfolio } from '../../actions/portfolioActions';
import TenderSummary from "./tender/TenderSummary";

interface PortfolioDetailProps extends RouteComponentProps<void> {
}

interface StateProps {
  portfolio: Portfolio;
  working: boolean;
  error: boolean;
  errorMessage: string;
}

interface DispatchProps {
    getPortfolio: (portfolioId: string) => void;
}

class PortfolioDetail extends React.Component<PortfolioDetailProps & StateProps & DispatchProps, {}> {
    constructor() {
        super();
    }

    componentDidMount(){
        var portfolioId = this.props.location.pathname.split('/')[2];        
        this.props.getPortfolio(portfolioId);
    }

    render() {
        if(this.props.error){
            return (<ErrorMessage content={this.props.errorMessage} />);
        }
        if(this.props.working || this.props.portfolio == null){
            return (<Spinner />);
        }
        var { portfolio } = this.props;
        var headerTitle = `Portfolios: ${portfolio.title}`;
        return (
            <div className="content-inner">
                <Header title={headerTitle} />
                <ul data-uk-tab>
                    <li><a href="#">Setup</a></li>
                    <li className="uk-active"><a href="#">Summary</a></li>
                    <li><a href="#">Meters</a></li>
                    <li><a href="#">Tenders</a></li>
                    <li><a href="#">Uploads</a></li>
                </ul>
                <ul className="uk-switcher restrict-height-hack">
                    <li><PortfolioSetup portfolio={portfolio}/></li>
                    <li><PortfolioSummary portfolio={portfolio}/></li>
                    <li className="restrict-height-hack"><PortfolioMeters portfolio={portfolio}/></li>
                    <li><TenderSummary portfolio={portfolio}/></li>
                    <li><PortfolioUploads portfolio={portfolio} /></li>
                </ul>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, PortfolioDetailProps> = (dispatch) => {
    return {
        getPortfolio: (portfolioId: string) => dispatch(getSinglePortfolio(portfolioId))        
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, PortfolioDetailProps> = (state: ApplicationState) => {
    return {
        portfolio: state.portfolio.selected.value,
        working: state.portfolio.selected.working,
        error: state.portfolio.selected.error,
        errorMessage: state.portfolio.selected.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(PortfolioDetail);