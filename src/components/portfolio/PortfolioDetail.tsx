import * as React from "react";
import Header from "../common/Header";
import ErrorMessage from "../common/ErrorMessage";
import { RouteComponentProps } from 'react-router';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../applicationState';
import { Portfolio, PortfolioDetails } from '../../model/Models';
import Spinner from '../common/Spinner';

import PortfolioSummary from "./summary/PortfolioSummary";
import PortfolioUploads from "./upload/PortfolioUploads";
import PortfolioMeters from "./mpan/PortfolioMeters";

import { getSinglePortfolio, getPortfolioDetails } from '../../actions/portfolioActions';
import TenderSummary from "./tender/TenderSummary";
import { Link } from "react-router-dom";

interface PortfolioDetailProps extends RouteComponentProps<void> {
}

interface StateProps {
  portfolio: Portfolio;
  detail: PortfolioDetails;
  working: boolean;
  error: boolean;
  errorMessage: string;
}

interface DispatchProps {
    getPortfolio: (portfolioId: string) => void;
    getPortfolioDetails: (portfolioId: string) => void;
}

class PortfolioDetail extends React.Component<PortfolioDetailProps & StateProps & DispatchProps, {}> {
    constructor() {
        super();
    }

    componentDidMount(){
        var portfolioId = this.props.location.pathname.split('/')[2];        
        this.props.getPortfolio(portfolioId);
        this.props.getPortfolioDetails(portfolioId);
    }

    render() {
        if(this.props.error){
            return (<ErrorMessage content={this.props.errorMessage} />);
        }
        if(this.props.working || this.props.portfolio == null){
            return (<Spinner />);
        }
        var { portfolio, detail } = this.props;
        var headerTitle = `Portfolio: ${portfolio.title}`;
        var accountLink = `/account/${detail.portfolio.accountId}`;
        return (
            <div className="content-inner">
                <Header title={headerTitle}>
                    <Link to={accountLink}><button className='uk-button uk-button-default uk-button-small'><span data-uk-icon='icon: link' /> Jump to Account</button></Link>
                </Header>
                <ul data-uk-tab>
                    <li className="uk-active"><a href="#">Summary</a></li>
                    <li><a href="#">Meters</a></li>
                    <li><a href="#">Tenders</a></li>
                    <li><a href="#">Uploads</a></li>
                </ul>
                <ul className="uk-switcher restrict-height-hack">
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
        getPortfolio: (portfolioId: string) => dispatch(getSinglePortfolio(portfolioId)),   
        getPortfolioDetails: (portfolioId: string) => dispatch(getPortfolioDetails(portfolioId))        
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, PortfolioDetailProps> = (state: ApplicationState) => {
    return {
        portfolio: state.portfolio.selected.value,
        detail: state.portfolio.details.value,
        working: state.portfolio.selected.working || state.portfolio.details.working,
        error: state.portfolio.selected.error || state.portfolio.details.error,
        errorMessage: state.portfolio.selected.errorMessage || state.portfolio.details.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(PortfolioDetail);